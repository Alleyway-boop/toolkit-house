import React, { useState, useMemo } from 'react'
import { cn } from '@/styles'

interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, item: T, index: number) => React.ReactNode
  width?: string
}

interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  pagination?: {
    pageSize: number
    currentPage: number
    onPageChange: (page: number) => void
  }
  sorting?: {
    sortKey: string | null
    sortDirection: 'asc' | 'desc'
    onSort: (key: string) => void
  }
  selection?: {
    selectedItems: T[]
    onSelectionChange: (items: T[]) => void
  }
  loading?: boolean
  className?: string
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  sorting,
  selection,
  loading = false,
  className,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sorting?.sortKey) return data

    return [...data].sort((a, b) => {
      const aValue = a[sorting.sortKey!]
      const bValue = b[sorting.sortKey!]

      if (aValue === bValue) return 0

      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return sorting.sortDirection === 'desc' ? -comparison : comparison
    })
  }, [data, sorting])

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = pagination.currentPage * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, pagination])

  const handleSort = (key: string) => {
    if (!sorting?.onSort) return

    const column = columns.find(col => col.key === key)
    if (!column?.sortable) return

    sorting.onSort(key)
  }

  const handleRowSelect = (item: T) => {
    if (!selection?.onSelectionChange) return

    const isSelected = selection.selectedItems.some(selected =>
      JSON.stringify(selected) === JSON.stringify(item)
    )

    const newSelection = isSelected
      ? selection.selectedItems.filter(selected =>
          JSON.stringify(selected) !== JSON.stringify(item)
        )
      : [...selection.selectedItems, item]

    selection.onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    if (!selection?.onSelectionChange) return

    const allSelected = paginatedData.every(item =>
      selection.selectedItems.some(selected =>
        JSON.stringify(selected) === JSON.stringify(item)
      )
    )

    const newSelection = allSelected
      ? selection.selectedItems.filter(selected =>
          !paginatedData.some(item => JSON.stringify(item) === JSON.stringify(selected))
        )
      : [...selection.selectedItems, ...paginatedData]

    selection.onSelectionChange(newSelection)
  }

  const toggleRowExpanded = (index: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  const getSortIcon = (key: string) => {
    if (sorting?.sortKey !== key) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }

    return sorting.sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const totalPages = pagination ? Math.ceil(data.length / pagination.pageSize) : 1

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Selection column */}
              {selection && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every(item =>
                      selection.selectedItems.some(selected =>
                        JSON.stringify(selected) === JSON.stringify(item)
                      )
                    )}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
              )}

              {/* Data columns */}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selection ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selection ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const isSelected = selection?.selectedItems.some(selected =>
                  JSON.stringify(selected) === JSON.stringify(item)
                )

                return (
                  <React.Fragment key={index}>
                    <tr className={cn(isSelected && 'bg-blue-50')}>
                      {/* Selection checkbox */}
                      {selection && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRowSelect(item)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      )}

                      {/* Data cells */}
                      {columns.map(column => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {column.render ? (
                            column.render(item[column.key], item, index)
                          ) : (
                            String(item[column.key] ?? '')
                          )}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {pagination.currentPage * pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min((pagination.currentPage + 1) * pagination.pageSize, data.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber = i
                  if (totalPages > 5) {
                    if (pagination.currentPage < 2) {
                      pageNumber = i
                    } else if (pagination.currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = pagination.currentPage - 2 + i
                    }
                  }

                  const isActive = pageNumber === pagination.currentPage

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => pagination.onPageChange(pageNumber)}
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        isActive
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      )}
                    >
                      {pageNumber + 1}
                    </button>
                  )
                })}

                <button
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}