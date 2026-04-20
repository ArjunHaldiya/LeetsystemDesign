'use client'

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node,
  Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ComponentNode } from './NodeTypes/ComponentNode'

const nodeTypes: NodeTypes = {
  componentNode: ComponentNode,
}

interface CanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  onNodesDelete: (nodes: Node[]) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
}

export function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodesDelete,
  onDrop,
  onDragOver,
}: CanvasProps) {
  return (
    <div className="flex-1 h-full bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={[24, 24]}
        fitView
        deleteKeyCode="Backspace"
        className="bg-zinc-950"
        style={{ backgroundColor: '#09090b' }}
      >
        <Background color="#3f3f46" gap={24} size={1} />
        <Controls className="!bg-zinc-900 !border-zinc-800 !rounded-xl !shadow-lg !shadow-black/30 [&>button]:!text-zinc-400 [&>button:hover]:!text-zinc-100 [&>button]:!border-zinc-800" />
        <MiniMap
          className="!bg-zinc-900 !border-zinc-800 !rounded-xl !shadow-lg !shadow-black/30"
          nodeColor={(n) => {
            const data = n.data as { color?: string }
            return data.color ?? '#52525b'
          }}
          maskColor="rgba(9,9,11,0.75)"
        />
      </ReactFlow>
    </div>
  )
}
