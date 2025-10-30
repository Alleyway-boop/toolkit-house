# License Management Best Practices

This guide provides comprehensive examples and best practices for using the `license-generator-package` in production environments.

## 🔐 Security Setup

### Production Environment Configuration

```typescript
import { LicenseGenerator, LicenseService } from 'license-generator'

// Production configuration using environment variables
const generator = new LicenseGenerator({
  encryptionKey: process.env.LICENSE_ENCRYPTION_KEY || process.env.LICENSE_KEY,
  defaultExpiryDays: parseInt(process.env.DEFAULT_LICENCE_EXPIRY_DAYS || '365'),
  outputDir: process.env.LICENSE_OUTPUT_DIR || '/secure/licenses'
})

// Service configuration
const licenseService = LicenseService.getInstance({
  encryptionKey: process.env.LICENSE_ENCRYPTION_KEY
})
```

### Environment Variables

Create a `.env` file in your project root:

```env
# License Configuration
LICENSE_ENCRYPTION_KEY=your-64-character-hex-key-here
DEFAULT_LICENCE_EXPIRY_DAYS=365
LICENSE_OUTPUT_DIR=/secure/licenses

# Application Configuration
NODE_ENV=production
API_BASE_URL=https://api.yourdomain.com
```

### Docker Configuration

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV LICENSE_ENCRYPTION_KEY=${LICENSE_ENCRYPTION_KEY}
ENV LICENSE_OUTPUT_DIR=/app/licenses

# Create licenses directory
RUN mkdir -p /app/licenses

# Change ownership
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Run application
CMD ["node", "server.js"]
```

## 🚀 Production Implementation

### License Validation Middleware

```typescript
import { Request, Response, NextFunction } from 'express'
import { LicenseService } from 'license-generator'

export class LicenseMiddleware {
  private static instance: LicenseMiddleware
  private licenseService: LicenseService

  private constructor() {
    this.licenseService = LicenseService.getInstance({
      encryptionKey: process.env.LICENSE_ENCRYPTION_KEY
    })
  }

  static getInstance(): LicenseMiddleware {
    if (!LicenseMiddleware.instance) {
      LicenseMiddleware.instance = new LicenseMiddleware()
    }
    return LicenseMiddleware.instance
  }

  validateLicense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const licenseKey = req.headers['license-key'] as string || req.query.license as string

      if (!licenseKey) {
        res.status(401).json({
          error: 'License key required',
          code: 'LICENSE_REQUIRED'
        })
        return
      }

      const result = this.licenseService.validateLicenseKey(licenseKey)

      if (!result.isValid) {
        res.status(401).json({
          error: 'Invalid license key',
          code: 'INVALID_LICENSE',
          details: result.error
        })
        return
      }

      // Add license info to request for downstream use
      req.license = {
        isValid: true,
        licenseId: result.data?.licenseId,
        issuedDate: result.data?.issuedDate,
        expiryDate: result.data?.expiryDate,
        remainingDays: this.calculateRemainingDays(result.data?.expiryDate)
      }

      next()
    } catch (error) {
      console.error('License validation error:', error)
      res.status(500).json({
        error: 'Internal server error',
        code: 'VALIDATION_ERROR'
      })
    }
  }

  private calculateRemainingDays(expiryDate?: string): number {
    if (!expiryDate) return 0

    const expiry = new Date(expiryDate)
    const now = new Date()
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  checkLicenseExpiry = (daysThreshold: number = 30) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.license) {
        next()
        return
      }

      const remainingDays = req.license.remainingDays

      if (remainingDays < daysThreshold) {
        res.set('X-License-Warning', `License expires in ${remainingDays} days`)
        console.warn(`License warning: ${req.license.licenseId} expires in ${remainingDays} days`)
      }

      next()
    }
  }
}

// Usage in Express application
import express from 'express'
const app = express()
const licenseMiddleware = LicenseMiddleware.getInstance()

// Apply to protected routes
app.get('/api/protected',
  licenseMiddleware.validateLicense,
  licenseMiddleware.checkLicenseExpiry(30),
  (req, res) => {
    res.json({
      message: 'Access granted',
      license: req.license
    })
  }
)

// Batch validation endpoint
app.post('/api/batch-validate',
  express.json(),
  async (req, res) => {
    try {
      const { licenseKeys } = req.body

      if (!Array.isArray(licenseKeys)) {
        return res.status(400).json({ error: 'License keys must be an array' })
      }

      const results = await Promise.allSettled(
        licenseKeys.map(key =>
          licenseMiddleware.licenseService.validateLicenseKey(key)
        )
      )

      const response = results.map((result, index) => ({
        licenseKey: licenseKeys[index],
        isValid: result.status === 'fulfilled' && result.value.isValid,
        error: result.status === 'fulfilled' ? result.value.error : result.reason.message
      }))

      res.json({ results: response })
    } catch (error) {
      res.status(500).json({ error: 'Batch validation failed' })
    }
  }
)
```

### License Management Service

```typescript
import { LicenseGenerator, LicenseService } from 'license-generator'
import { promises as fs } from 'fs'
import path from 'path'

export interface LicenseInfo {
  licenseId: string
  issuedDate: string
  expiryDate: string
  remainingDays: number
  isValid: boolean
}

export class LicenseManager {
  private generator: LicenseGenerator
  private service: LicenseService
  private licenseCache: Map<string, LicenseInfo> = new Map()

  constructor() {
    this.generator = new LicenseGenerator({
      encryptionKey: process.env.LICENSE_ENCRYPTION_KEY!,
      defaultExpiryDays: parseInt(process.env.DEFAULT_LICENCE_EXPIRY_DAYS || '365'),
      outputDir: process.env.LICENSE_OUTPUT_DIR || '/secure/licenses'
    })

    this.service = LicenseService.getInstance({
      encryptionKey: process.env.LICENSE_ENCRYPTION_KEY!
    })

    // Load existing licenses on startup
    this.loadLicenses().catch(console.error)
  }

  async generateLicense(expiryDays?: number): Promise<{ licenseKey: string; licenseInfo: LicenseInfo }> {
    const licenseKey = this.generator.generateLicense(expiryDays)
    const licenseInfo = await this.validateLicense(licenseKey)

    // Save to file
    await this.saveLicenseToFile(licenseKey)

    return { licenseKey, licenseInfo }
  }

  async generateBatchLicenses(count: number, expiryDays?: number): Promise<Array<{ licenseKey: string; licenseInfo: LicenseInfo }>> {
    const licenseKeys = this.generator.generateBatchLicenses(count, expiryDays)
    const results = []

    for (const licenseKey of licenseKeys) {
      const licenseInfo = await this.validateLicense(licenseKey)
      await this.saveLicenseToFile(licenseKey)
      results.push({ licenseKey, licenseInfo })
    }

    return results
  }

  async validateLicense(licenseKey: string): Promise<LicenseInfo> {
    const result = this.service.validateLicenseKey(licenseKey)

    if (!result.isValid || !result.data) {
      throw new Error(result.error || 'Invalid license')
    }

    const remainingDays = this.calculateRemainingDays(result.data.expiryDate)

    const licenseInfo: LicenseInfo = {
      licenseId: result.data.licenseId,
      issuedDate: result.data.issuedDate,
      expiryDate: result.data.expiryDate,
      remainingDays,
      isValid: true
    }

    // Cache the result
    this.licenseCache.set(licenseKey, licenseInfo)

    return licenseInfo
  }

  async validateLicenseWithCache(licenseKey: string): Promise<LicenseInfo> {
    // Check cache first
    const cached = this.licenseCache.get(licenseKey)
    if (cached && this.calculateRemainingDays(cached.expiryDate) > 0) {
      return cached
    }

    // Validate and cache
    return await this.validateLicense(licenseKey)
  }

  async getLicenseStats(): Promise<{
    totalLicenses: number
    validLicenses: number
    expiringSoon: number
    expired: number
  }> {
    const validLicenses = Array.from(this.licenseCache.values())

    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    return {
      totalLicenses: validLicenses.length,
      validLicenses: validLicenses.filter(l => l.isValid).length,
      expiringSoon: validLicenses.filter(l =>
        l.remainingDays > 0 && l.remainingDays <= 30
      ).length,
      expired: validLicenses.filter(l =>
        l.remainingDays <= 0
      ).length
    }
  }

  async cleanupExpiredLicenses(): Promise<number> {
    const now = new Date()
    let cleanedCount = 0

    for (const [licenseKey, licenseInfo] of this.licenseCache.entries()) {
      if (licenseInfo.remainingDays <= 0) {
        this.licenseCache.delete(licenseKey)
        cleanedCount++
      }
    }

    return cleanedCount
  }

  private async saveLicenseToFile(licenseKey: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `license-${timestamp}.txt`
    const filepath = path.join(this.generator.config.outputDir, filename)

    await this.generator.saveLicenseToFile(licenseKey, filename)
  }

  private async loadLicenses(): Promise<void> {
    try {
      const outputDir = this.generator.config.outputDir

      if (!(await this.isDirectoryExists(outputDir))) {
        return
      }

      const files = await fs.readdir(outputDir)
      const licenseFiles = files.filter(file => file.endsWith('.txt'))

      for (const file of licenseFiles) {
        const filepath = path.join(outputDir, file)
        const content = await fs.readFile(filepath, 'utf8')

        // Extract license key from file content
        const licenseKey = content.split('\n')[1].replace('许可证密钥:', '').trim()

        try {
          await this.validateLicense(licenseKey)
        } catch (error) {
          console.warn(`Failed to load license from ${file}:`, error)
        }
      }

      console.log(`Loaded ${this.licenseCache.size} licenses`)
    } catch (error) {
      console.error('Failed to load licenses:', error)
    }
  }

  private async isDirectoryExists(dirPath: string): Promise<boolean> {
    try {
      await fs.access(dirPath)
      return true
    } catch {
      return false
    }
  }

  private calculateRemainingDays(expiryDate: string): number {
    const expiry = new Date(expiryDate)
    const now = new Date()
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  // License rotation and key management
  async rotateLicenseKey(): Promise<string> {
    const newKey = this.generator.generateKeyPair()

    // Update service with new key
    this.service = LicenseService.getInstance({
      encryptionKey: newKey
    })

    // Clear old cached licenses
    this.licenseCache.clear()

    return newKey
  }

  async auditLicenseUsage(): Promise<Array<{
    licenseId: string
    lastUsed: string
    usageCount: number
    isValid: boolean
  }>> {
    // This would need to be implemented with usage tracking
    // For now, return cached license information
    return Array.from(this.licenseCache.entries()).map(([licenseKey, info]) => ({
      licenseId: info.licenseId,
      lastUsed: new Date().toISOString(),
      usageCount: 1, // Placeholder
      isValid: info.isValid
    }))
  }
}

// Usage example
const licenseManager = new LicenseManager()

// Generate new license
async function createNewLicense() {
  try {
    const { licenseKey, licenseInfo } = await licenseManager.generateLicense(365)
    console.log('New license created:', licenseKey)
    console.log('License info:', licenseInfo)
  } catch (error) {
    console.error('Failed to create license:', error)
  }
}

// Batch license generation
async function createBatchLicenses() {
  try {
    const licenses = await licenseManager.generateBatchLicenses(10, 180)
    console.log('Created', licenses.length, 'licenses')
  } catch (error) {
    console.error('Failed to create batch licenses:', error)
  }
}

// License validation with cache
async function checkLicense(licenseKey: string) {
  try {
    const licenseInfo = await licenseManager.validateLicenseWithCache(licenseKey)
    console.log('License valid:', licenseInfo)
  } catch (error) {
    console.error('License validation failed:', error)
  }
}
```

## 📊 Monitoring and Alerting

### License Monitoring Service

```typescript
import { EventEmitter } from 'events'
import { LicenseManager } from './LicenseManager'

export class LicenseMonitor extends EventEmitter {
  private manager: LicenseManager
  private checkInterval: NodeJS.Timeout | null = null
  private alertThreshold: number

  constructor(manager: LicenseManager, alertThreshold: number = 30) {
    super()
    this.manager = manager
    this.alertThreshold = alertThreshold
  }

  startMonitoring(intervalMs: number = 3600000): void { // 1 hour default
    if (this.checkInterval) {
      this.stopMonitoring()
    }

    this.checkInterval = setInterval(async () => {
      await this.checkLicenseStatus()
    }, intervalMs)

    // Initial check
    this.checkLicenseStatus()
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private async checkLicenseStatus(): Promise<void> {
    try {
      const stats = await this.manager.getLicenseStats()

      this.emit('stats', stats)

      // Check for expiring licenses
      if (stats.expiringSoon > 0) {
        this.emit('alert', {
          type: 'WARNING',
          message: `${stats.expiringSoon} licenses expiring soon`,
          stats
        })
      }

      // Check for expired licenses
      if (stats.expired > 0) {
        this.emit('alert', {
          type: 'ERROR',
          message: `${stats.expired} licenses have expired`,
          stats
        })
      }

      // Check license usage
      const audit = await this.manager.auditLicenseUsage()
      const activeUsage = audit.filter(a => a.isValid && a.usageCount > 0)

      if (activeUsage.length > 0) {
        this.emit('usage', {
          totalActive: activeUsage.length,
          licenses: activeUsage
        })
      }

    } catch (error) {
      this.emit('error', error)
    }
  }

  async generateReport(): Promise<{
    timestamp: string
    stats: any
    alerts: any[]
    licenses: any[]
    health: 'good' | 'warning' | 'critical'
  }> {
    const stats = await this.manager.getLicenseStats()
    const audit = await this.manager.auditLicenseUsage()

    let health: 'good' | 'warning' | 'critical' = 'good'
    const alerts: any[] = []

    if (stats.expired > 0) {
      health = 'critical'
      alerts.push({
        type: 'CRITICAL',
        message: `${stats.expired} licenses have expired`
      })
    } else if (stats.expiringSoon > 0) {
      health = 'warning'
      alerts.push({
        type: 'WARNING',
        message: `${stats.expiringSoon} licenses expiring soon`
      })
    }

    return {
      timestamp: new Date().toISOString(),
      stats,
      alerts,
      licenses: audit,
      health
    }
  }
}

// Usage example
const licenseManager = new LicenseManager()
const monitor = new LicenseMonitor(licenseManager)

// Set up event listeners
monitor.on('stats', (stats) => {
  console.log('License stats:', stats)
})

monitor.on('alert', (alert) => {
  console.log('License alert:', alert)

  // Send alert to monitoring system
  if (alert.type === 'ERROR') {
    sendAlertToSlack(`🚨 License Alert: ${alert.message}`)
  }
})

monitor.on('usage', (usage) => {
  console.log('License usage:', usage)
})

monitor.on('error', (error) => {
  console.error('License monitoring error:', error)
})

// Start monitoring
monitor.startMonitoring(3600000) // Check every hour

// Generate weekly report
async function generateWeeklyReport() {
  const report = await monitor.generateReport()

  // Save report or send to monitoring system
  console.log('Weekly license report:', report)
}
```

### Slack Integration for Alerts

```typescript
import fetch from 'node-fetch'

interface SlackMessage {
  text: string
  channel?: string
  username?: string
  icon_emoji?: string
}

export class SlackNotifier {
  private webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  async sendAlert(message: string, severity: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
    const iconMap = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '🚨'
    }

    const slackMessage: SlackMessage = {
      text: `${iconMap[severity]} ${message}`,
      username: 'License Bot',
      icon_emoji: ':shield:'
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slackMessage)
      })

      if (!response.ok) {
        console.error('Failed to send Slack alert:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error sending Slack alert:', error)
    }
  }

  async sendLicenseStats(stats: any): Promise<void> {
    const message = `
📊 **License Statistics**

• Total Licenses: ${stats.totalLicenses}
• Valid Licenses: ${stats.validLicenses}
• Expiring Soon: ${stats.expiringSoon}
• Expired: ${stats.expired}

*Report generated at ${new Date().toLocaleString()}*
    `.trim()

    await this.sendAlert(message, 'info')
  }
}

// Usage
const slackNotifier = new SlackNotifier(process.env.SLACK_WEBHOOK_URL!)

// Send alert when license expires
monitor.on('alert', async (alert) => {
  await slackNotifier.sendAlert(alert.message, alert.type.toLowerCase() as any)
})
```

## 🔧 Maintenance Scripts

### Daily License Cleanup

```typescript
// scripts/cleanup-licenses.js
import { LicenseManager } from '../src/LicenseManager'
import { promises as fs } from 'fs'
import path from 'path'

async function cleanupLicenses() {
  try {
    console.log('Starting license cleanup...')

    const licenseManager = new LicenseManager()
    const cleanedCount = await licenseManager.cleanupExpiredLicenses()

    console.log(`Cleaned up ${cleanedCount} expired licenses`)

    // Generate cleanup report
    const stats = await licenseManager.getLicenseStats()
    console.log('Current license stats:', stats)

  } catch (error) {
    console.error('License cleanup failed:', error)
    process.exit(1)
  }
}

cleanupLicenses()
```

### Weekly License Audit

```typescript
// scripts/audit-licenses.js
import { LicenseManager } from '../src/LicenseManager'
import { LicenseMonitor } from '../src/LicenseMonitor'
import { SlackNotifier } from '../src/SlackNotifier'

async function performAudit() {
  try {
    console.log('Starting weekly license audit...')

    const licenseManager = new LicenseManager()
    const monitor = new LicenseMonitor(licenseManager)
    const slackNotifier = new SlackNotifier(process.env.SLACK_WEBHOOK_URL!)

    // Generate comprehensive report
    const report = await monitor.generateReport()

    console.log('Audit completed:', report)

    // Send report to Slack
    if (report.health === 'critical') {
      await slackNotifier.sendAlert(
        `🚨 CRITICAL: License audit shows issues\n` +
        `• Expired licenses: ${report.stats.expired}\n` +
        `• Expiring soon: ${report.stats.expiringSoon}\n` +
        `• Total licenses: ${report.stats.totalLicenses}`,
        'error'
      )
    } else if (report.health === 'warning') {
      await slackNotifier.sendAlert(
        `⚠️ WARNING: License audit shows expiring licenses\n` +
        `• Expiring soon: ${report.stats.expiringSoon}\n` +
        `• Total licenses: ${report.stats.totalLicenses}`,
        'warning'
      )
    }

    // Save report to file
    const reportPath = path.join(process.cwd(), 'reports', `audit-${Date.now()}.json`)
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2))

    console.log(`Audit report saved to: ${reportPath}`)

  } catch (error) {
    console.error('License audit failed:', error)
    process.exit(1)
  }
}

performAudit()
```

## 📋 Configuration Management

### Production Configuration Template

```typescript
// src/config/license.config.ts
export interface LicenseConfig {
  encryptionKey: string
  defaultExpiryDays: number
  outputDir: string
  maxBatchSize: number
  enableAuditLogging: boolean
  cacheTimeoutMs: number
  monitoringIntervalMs: number
  alertThresholdDays: number
  slackWebhookUrl?: string
}

export const getLicenseConfig = (): LicenseConfig => {
  return {
    encryptionKey: process.env.LICENSE_ENCRYPTION_KEY!,
    defaultExpiryDays: parseInt(process.env.DEFAULT_LICENCE_EXPIRY_DAYS || '365'),
    outputDir: process.env.LICENSE_OUTPUT_DIR || '/secure/licenses',
    maxBatchSize: parseInt(process.env.MAX_BATCH_SIZE || '10000'),
    enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING === 'true',
    cacheTimeoutMs: parseInt(process.env.CACHE_TIMEOUT_MS || '3600000'),
    monitoringIntervalMs: parseInt(process.env.MONITORING_INTERVAL_MS || '3600000'),
    alertThresholdDays: parseInt(process.env.ALERT_THRESHOLD_DAYS || '30'),
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL
  }
}
```

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - LICENSE_ENCRYPTION_KEY=${LICENSE_ENCRYPTION_KEY}
      - DEFAULT_LICENCE_EXPIRY_DAYS=365
      - LICENSE_OUTPUT_DIR=/app/licenses
      - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
    volumes:
      - ./licenses:/app/licenses
    ports:
      - "3000:3000"
    restart: unless-stopped

  license-monitor:
    build: .
    command: node scripts/monitor-licenses.js
    environment:
      - NODE_ENV=production
      - LICENSE_ENCRYPTION_KEY=${LICENSE_ENCRYPTION_KEY}
      - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
    volumes:
      - ./licenses:/app/licenses
    restart: unless-stopped

  license-cleanup:
    build: .
    command: node scripts/cleanup-licenses.js
    environment:
      - NODE_ENV=production
      - LICENSE_ENCRYPTION_KEY=${LICENSE_ENCRYPTION_KEY}
    volumes:
      - ./licenses:/app/licenses
    restart: unless-stopped
    schedule: "0 2 * * *" # Run daily at 2 AM
```

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Generate strong encryption key
- [ ] Set up environment variables
- [ ] Configure storage for license files
- [ ] Set up monitoring and alerting
- [ ] Create backup strategy
- [ ] Test license validation flow
- [ ] Configure CI/CD pipeline

### Post-Deployment

- [ ] Verify license generation works
- [ ] Test license validation
- [ ] Monitor for alerts
- [ ] Check license file permissions
- [ ] Verify backup and recovery
- [ ] Monitor system performance

### Maintenance Tasks

- [ ] Daily: Run license cleanup
- [ ] Weekly: Generate audit reports
- [ ] Monthly: Rotate encryption keys (recommended)
- [ ] Quarterly: Review license usage patterns
- [ ] Annually: Review security policies

This comprehensive guide covers production-ready implementation of the license generator package, including security best practices, monitoring, maintenance, and deployment strategies.