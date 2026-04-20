'use client'

import { categories, getComponentsByCategory, PaletteComponent } from '@/lib/components-palette'

interface DraggableItemProps {
  component: PaletteComponent
}

function DraggableItem({ component }: DraggableItemProps) {
  function onDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('application/reactflow-component', JSON.stringify(component))
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-transparent hover:border-zinc-700/60 hover:bg-zinc-800/60 cursor-grab active:cursor-grabbing transition-all select-none group"
    >
      <div
        className="w-2 h-2 rounded-full shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: component.color }}
      />
      <span className="text-zinc-400 text-xs group-hover:text-zinc-200 transition-colors">{component.label}</span>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="w-52 bg-zinc-950 border-r border-zinc-800/60 flex flex-col overflow-y-auto shrink-0">
      <div className="px-4 py-4 border-b border-zinc-800/60">
        <h2 className="text-zinc-300 text-xs font-semibold tracking-widest uppercase">Components</h2>
        <p className="text-zinc-600 text-[10px] mt-0.5">Drag onto canvas</p>
      </div>

      <div className="flex flex-col gap-5 p-3 pt-4">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-1.5 px-2.5">
              <span className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest">{cat}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {getComponentsByCategory(cat).map((comp) => (
                <DraggableItem key={comp.id} component={comp} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
