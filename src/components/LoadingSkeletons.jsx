"use client"

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="w-12 h-12 bg-gray-700 rounded mb-4" />
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-700 rounded w-1/2" />
    </div>
  )
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700 rounded animate-pulse"
            style={{ width: `${80 + Math.random() * 20}%` }}
          />
        ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
        ))}
    </div>
  )
}
