/**
 * 环境相关常量
 */

/**
 * 环境类型
 */
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  TESTING: 'testing',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

/**
 * 环境简称
 */
export const ENV_SHORT_NAMES = {
  [ENVIRONMENTS.DEVELOPMENT]: 'dev',
  [ENVIRONMENTS.TESTING]: 'test',
  [ENVIRONMENTS.STAGING]: 'stg',
  [ENVIRONMENTS.PRODUCTION]: 'prod',
} as const;

/**
 * 环境显示文本
 */
export const ENV_DISPLAY_NAMES = {
  [ENVIRONMENTS.DEVELOPMENT]: '开发环境',
  [ENVIRONMENTS.TESTING]: '测试环境',
  [ENVIRONMENTS.STAGING]: '预发布环境',
  [ENVIRONMENTS.PRODUCTION]: '生产环境',
} as const;

/**
 Node.js 环境
 */
export const NODE_ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

/**
 * 浏览器环境
 */
export const BROWSER_ENVIRONMENTS = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  SAFARI: 'safari',
  EDGE: 'edge',
  IE: 'ie',
  OPERA: 'opera',
} as const;

/**
 * 操作系统
 */
export const OPERATING_SYSTEMS = {
  WINDOWS: 'windows',
  MACOS: 'macos',
  LINUX: 'linux',
  IOS: 'ios',
  ANDROID: 'android',
} as const;

/**
 * 设备类型
 */
export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  TV: 'tv',
  WEARABLE: 'wearable',
} as const;

/**
 * 部署环境
 */
export const DEPLOYMENT_ENVIRONMENTS = {
  LOCAL: 'local',
  CLOUD: 'cloud',
  ON_PREMISE: 'on_premise',
  HYBRID: 'hybrid',
} as const;

/**
 * 云平台提供商
 */
export const CLOUD_PROVIDERS = {
  AWS: 'aws',
  AZURE: 'azure',
  GOOGLE_CLOUD: 'google_cloud',
  ALIBABA_CLOUD: 'alibaba_cloud',
  TENCENT_CLOUD: 'tencent_cloud',
  HUAWEI_CLOUD: 'huawei_cloud',
  VOLCENGINE: 'volcengine',
} as const;

/**
 * 容器运行时
 */
export const CONTAINER_RUNTIMES = {
  DOCKER: 'docker',
  CONTAINERD: 'containerd',
  PODMAN: 'podman',
  CRI_O: 'cri-o',
} as const;

/**
 * 编排平台
 */
export const ORCHESTRATION_PLATFORMS = {
  KUBERNETES: 'kubernetes',
  DOCKER_SWARM: 'docker_swarm',
  OPENSHIFT: 'openshift',
  ECS: 'ecs',
} as const;

/**
 * CI/CD 平台
 */
export const CICD_PLATFORMS = {
  JENKINS: 'jenkins',
  GITHUB_ACTIONS: 'github_actions',
  GITLAB_CI: 'gitlab_ci',
  CIRCLECI: 'circleci',
  TRAVIS_CI: 'travis_ci',
  AZURE_PIPELINES: 'azure_pipelines',
  GOOGLE_CLOUD_BUILD: 'google_cloud_build',
  CODEBUILD: 'codebuild',
} as const;

/**
 * 监控平台
 */
export const MONITORING_PLATFORMS = {
  PROMETHEUS: 'prometheus',
  GRAFANA: 'grafana',
  DATADOG: 'datadog',
  NEW_RELIC: 'new_relic',
  ELK_STACK: 'elk_stack',
  SPLUNK: 'splunk',
  SENTRY: 'sentry',
} as const;

/**
 * 日志级别
 */
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const;

/**
 * 日志级别数值（用于比较）
 */
export const LOG_LEVEL_VALUES = {
  [LOG_LEVELS.DEBUG]: 0,
  [LOG_LEVELS.INFO]: 1,
  [LOG_LEVELS.WARN]: 2,
  [LOG_LEVELS.ERROR]: 3,
  [LOG_LEVELS.FATAL]: 4,
} as const;