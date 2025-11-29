import React, { useMemo } from 'react'
import { BinaryTree } from '@toolkit-house/ts-utils/data-structures'
import { DataStructureVisualizationProps } from '@/types'
import { cn } from '@/styles'

interface TreeNode {
  value: any
  left?: TreeNode
  right?: TreeNode
  x?: number
  y?: number
  highlight?: boolean
}

interface BinaryTreeVisualizationProps extends DataStructureVisualizationProps<BinaryTree<any>> {
  nodeSpacing?: number
  levelHeight?: number
  showConnections?: boolean
  onNodeClick?: (value: any) => void
}

export function BinaryTreeVisualization({
  data,
  nodeSpacing = 80,
  levelHeight = 100,
  showConnections = true,
  onNodeClick,
  className
}: BinaryTreeVisualizationProps) {
  const treeLayout = useMemo(() => {
    if (!data) return { nodes: [], edges: [] }

    const nodes: Array<TreeNode & { x: number; y: number }> = []
    const edges: Array<{ from: TreeNode; to: TreeNode }> = []

    // Convert binary tree to array format for layout calculation
    const toArray = (tree: BinaryTree<any>): (TreeNode & { x?: number; y?: number })[] => {
      const result: TreeNode[] = []

      const traverse = (node: any, x = 0, y = 0) => {
        if (!node) return

        const treeNode: TreeNode = {
          value: node.value,
          x,
          y
        }

        result.push(treeNode)

        if (node.left) {
          traverse(node.left, x - 1, y + 1)
        }
        if (node.right) {
          traverse(node.right, x + 1, y + 1)
        }
      }

      traverse(data.root)
      return result
    }

    const nodeArray = toArray(data)

    // Calculate positions
    const maxX = Math.max(...nodeArray.map(n => Math.abs(n.x || 0)))

    nodeArray.forEach(node => {
      const x = (node.x || 0) * nodeSpacing + (maxX * nodeSpacing)
      const y = (node.y || 0) * levelHeight + 50

      nodes.push({
        ...node,
        x,
        y
      })
    })

    // Create edges
    const createEdges = (node: any, parent?: TreeNode) => {
      if (!node) return

      const current = nodes.find(n => n.value === node.value)
      if (!current) return

      if (parent) {
        edges.push({ from: parent, to: current })
      }

      if (node.left) {
        createEdges(node.left, current)
      }
      if (node.right) {
        createEdges(node.right, current)
      }
    }

    createEdges(data.root)

    return { nodes, edges }
  }, [data, nodeSpacing, levelHeight])

  const svgWidth = Math.max(600, treeLayout.nodes.length * 100)
  const svgHeight = Math.max(400, (Math.max(...treeLayout.nodes.map(n => n.y || 0)) + 100))

  return (
    <div className={cn('w-full overflow-auto border border-gray-200 rounded-lg bg-white p-4', className)}>
      <svg width={svgWidth} height={svgHeight} className="w-full">
        {/* Draw edges */}
        {showConnections && treeLayout.edges.map((edge, index) => (
          <line
            key={`edge-${index}`}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke="#9ca3af"
            strokeWidth="2"
          />
        ))}

        {/* Draw nodes */}
        {treeLayout.nodes.map((node, index) => (
          <g key={`node-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              className={cn(
                'fill-white stroke-2 cursor-pointer transition-all duration-200',
                node.highlight ? 'stroke-red-500 fill-red-50' : 'stroke-blue-500 hover:stroke-blue-600',
                'hover:fill-blue-50'
              )}
              onClick={() => onNodeClick?.(node.value)}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-800 pointer-events-none select-none"
            >
              {String(node.value)}
            </text>
          </g>
        ))}
      </svg>

      {/* Tree information */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Nodes:</span> {data?.count() || 0}
          </div>
          <div>
            <span className="font-medium">Height:</span> {data?.getHeight() || 0}
          </div>
          <div>
            <span className="font-medium">Type:</span> Binary Tree
          </div>
        </div>
      </div>
    </div>
  )
}