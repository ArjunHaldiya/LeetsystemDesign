'use client'

import {
  ReactFlow,
  Background,
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
  isLocked: boolean
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
  isLocked,
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
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        className="bg-zinc-950"
        style={{ backgroundColor: '#09090b' }}
      >
        <Background color="#3f3f46" gap={24} size={1} />
      </ReactFlow>
    </div>
  )
}
