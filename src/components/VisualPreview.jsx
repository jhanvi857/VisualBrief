"use client"

import { useState } from "react"

export default function VisualPreview({ data }) {
  const [draggedNode, setDraggedNode] = useState(null)
  const [nodes, setNodes] = useState(data.nodes)

  const handleMouseDown = (nodeId) => {
    setDraggedNode(nodeId)
  }

  const handleMouseMove = (e) => {
    if (!draggedNode) return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setNodes(nodes.map((node) => (node.id === draggedNode ? { ...node, x, y } : node)))
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm h-full">
      <h3 className="text-lg font-bold text-white mb-4">Visual Mind Map</h3>
      <svg
        className="w-full h-96 bg-slate-900/50 rounded-lg border border-slate-700"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Draw edges */}
        {data.edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)
          if (!fromNode || !toNode) return null

          return (
            <line
              key={`edge-${idx}`}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="#64748b"
              strokeWidth="2"
              opacity="0.5"
            />
          )
        })}

        {/* Draw nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="24"
              fill="#4f46e5"
              opacity="0.8"
              onMouseDown={() => handleMouseDown(node.id)}
              className="cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity"
            />
            <text
              x={`${node.x}%`}
              y={`${node.y}%`}
              textAnchor="middle"
              dy="0.3em"
              className="text-xs font-semibold fill-white pointer-events-none"
            >
              {node.label.split(" ")[0]}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-slate-400 mt-3">💡 Drag nodes to rearrange the mind map</p>
    </div>
  )
}
