'use client'

import { Handle, Position, NodeProps } from '@xyflow/react'

interface ComponentNodeData extends Record<string, unknown> {
  label: string
  category: string
  color: string
}

export function ComponentNode({ data, selected }: NodeProps) {
  const { label, category, color } = data as ComponentNodeData

  return (
    <div className="relative min-w-[130px]">
      {/* Inner wrapper has overflow-hidden for rounded corners; handles live outside it */}
      <div
        className={`
          flex items-stretch rounded-xl overflow-hidden
          bg-zinc-900 border transition-all duration-150
          ${selected
            ? 'border-blue-400/70 shadow-[0_0_0_1px_rgba(96,165,250,0.3),0_4px_24px_rgba(0,0,0,0.5)]'
            : 'border-zinc-700/80 shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:border-zinc-500/80'}
        `}
      >
        {/* Left color accent bar */}
        <div className="w-[3px] shrink-0" style={{ backgroundColor: color }} />

        {/* Content */}
        <div className="px-3 py-2.5 flex flex-col gap-0.5">
          <div className="text-zinc-100 text-sm font-medium leading-tight">{label}</div>
          <div
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: `${color}99` }}
          >
            {category}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-600 !border-zinc-500 !w-2 !h-2 !top-[-4px]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-600 !border-zinc-500 !w-2 !h-2 !bottom-[-4px]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-zinc-600 !border-zinc-500 !w-2 !h-2 !left-[-4px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-zinc-600 !border-zinc-500 !w-2 !h-2 !right-[-4px]"
      />
    </div>
  )
}
