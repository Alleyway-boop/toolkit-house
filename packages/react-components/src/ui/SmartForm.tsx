import React, { useState } from 'react'
import { SmartFormConfig } from '@/types'
import { cn } from '@/styles'

interface SmartFormProps extends SmartFormConfig {
  className?: string
}

export function SmartForm({
  fields,
  validation,
  layout = 'vertical',
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  onSubmit,
  className
}: SmartFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {}
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.name] = field.defaultValue
      }
    })
    return initialValues
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name: string, value: any): string | null => {
    const field = fields.find(f => f.name === name)
    if (!field?.validation) return null

    for (const rule of field.validation) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return rule.message
          }
          break
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return rule.message
          }
          break
        case 'min':
          if (typeof value === 'string' && value.length < rule.value) {
            return rule.message
          }
          if (typeof value === 'number' && value < rule.value) {
            return rule.message
          }
          break
        case 'max':
          if (typeof value === 'string' && value.length > rule.value) {
            return rule.message
          }
          if (typeof value === 'number' && value > rule.value) {
            return rule.message
          }
          break
        case 'pattern':
          if (value && !new RegExp(rule.value).test(value)) {
            return rule.message
          }
          break
        case 'custom':
          if (!rule.value(value)) {
            return rule.message
          }
          break
      }
    }

    return null
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate all fields
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name])
      if (error) {
        newErrors[field.name] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    const initialValues: Record<string, any> = {}
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.name] = field.defaultValue
      }
    })
    setFormData(initialValues)
    setErrors({})
  }

  const renderField = (field: SmartFormConfig['fields'][0]) => {
    const value = formData[field.name]
    const error = errors[field.name]

    const commonClasses = cn(
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      error ? 'border-red-500' : 'border-gray-300',
      field.disabled && 'bg-gray-100 cursor-not-allowed'
    )

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={commonClasses}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={3}
            className={commonClasses}
          />
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            disabled={field.disabled}
            className={commonClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              disabled={field.disabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{field.label}</span>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={field.disabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const layoutClasses = {
    vertical: 'space-y-4',
    horizontal: 'grid grid-cols-2 gap-4',
    grid: 'grid grid-cols-3 gap-4'
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className={layoutClasses[layout]}>
        {fields.map(field => (
          <div key={field.name} className={cn(
            field.type === 'radio' ? 'col-span-full' : '',
            layout === 'grid' && field.type === 'textarea' ? 'col-span-full' : ''
          )}>
            {field.type !== 'checkbox' && field.type !== 'radio' && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {renderField(field)}
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {field.description && (
              <p className="mt-1 text-sm text-gray-500">{field.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetButtonText}
        </button>
      </div>
    </form>
  )
}