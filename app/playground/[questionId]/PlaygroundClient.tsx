'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import { Question, GradeResponse } from '@/lib/types'
import { Canvas } from '@/components/Canvas'
import { Sidebar } from '@/components/Sidebar'
import { QuestionPanel } from '@/components/QuestionPanel'
import { ScorePanel } from '@/components/ScorePanel'
import { PaletteComponent } from '@/lib/components-palette'

interface PlaygroundClientProps {
  question: Question
}

function PlaygroundInner({ question }: PlaygroundClientProps) {
  const { screenToFlowPosition } = useReactFlow()

  const storageKey = `design-${question.id}`

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [gradeResult, setGradeResult] = useState<GradeResponse | null>(null)
  const [isGrading, setIsGrading] = useState(false)
  const [isHinting, setIsHinting] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const [shareToast, setShareToast] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from localStorage or URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('design')
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(encoded)) as { nodes: Node[]; edges: Edge[] }
        setNodes(decoded.nodes ?? [])
        setEdges(decoded.edges ?? [])
        setInitialized(true)
        return
      } catch {
        // fall through to localStorage
      }
    }
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { nodes: Node[]; edges: Edge[] }
        setNodes(parsed.nodes ?? [])
        setEdges(parsed.edges ?? [])
      } catch {
        // ignore corrupt data
      }
    }
    setInitialized(true)
  }, [storageKey])

  // Auto-save with debounce
  useEffect(() => {
    if (!initialized) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify({ nodes, edges }))
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [nodes, edges, initialized, storageKey])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  )

  const onNodesDelete = useCallback((deleted: Node[]) => {
    const deletedIds = new Set(deleted.map((n) => n.id))
    setEdges((eds) => eds.filter((e) => !deletedIds.has(e.source) && !deletedIds.has(e.target)))
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const raw = e.dataTransfer.getData('application/reactflow-component')
      if (!raw) return
      let component: PaletteComponent
      try {
        component = JSON.parse(raw) as PaletteComponent
      } catch {
        return
      }
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const newNode: Node = {
        id: `${component.id}-${Date.now()}`,
        type: 'componentNode',
        position,
        data: {
          label: component.label,
          category: component.category,
          color: component.color,
        },
      }
      setNodes((nds) => [...nds, newNode])
    },
    [screenToFlowPosition]
  )

  async function handleRunTests() {
    setIsGrading(true)
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, nodes, edges }),
      })
      const data = (await res.json()) as GradeResponse
      setGradeResult(data)
    } catch {
      setGradeResult({
        score: 0,
        strengths: [],
        missing: ['Network error — please try again'],
        feedback: 'Could not reach the grading service.',
      })
    } finally {
      setIsGrading(false)
    }
  }

  async function handleHint() {
    setIsHinting(true)
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, nodes }),
      })
      if (res.ok) {
        const data = (await res.json()) as { hint: string }
        setHint(data.hint)
      }
    } catch {
      // ignore hint failures silently
    } finally {
      setIsHinting(false)
    }
  }

  function handleShare() {
    const encoded = btoa(JSON.stringify({ nodes, edges }))
    const url = `${window.location.origin}/playground/${question.id}?design=${encoded}`
    navigator.clipboard.writeText(url).catch(() => {})
    setShareToast(true)
    setTimeout(() => setShareToast(false), 2000)
  }

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 h-full overflow-hidden">
        <Canvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onDrop={onDrop}
          onDragOver={onDragOver}
        />
        <div className="flex flex-col w-72 border-l border-zinc-800 overflow-y-auto">
          <QuestionPanel
            question={question}
            nodeCount={nodes.length}
            isGrading={isGrading}
            isHinting={isHinting}
            hint={hint}
            onRunTests={handleRunTests}
            onHint={handleHint}
            onShare={handleShare}
            shareToast={shareToast}
          />
          {gradeResult && (
            <ScorePanel result={gradeResult} onClose={() => setGradeResult(null)} />
          )}
        </div>
      </main>
    </div>
  )
}

export function PlaygroundClient({ question }: PlaygroundClientProps) {
  return (
    <ReactFlowProvider>
      <PlaygroundInner question={question} />
    </ReactFlowProvider>
  )
}
