export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  title: string
  company: string
  difficulty: Difficulty
  description: string
  requirements: {
    functional: string[]
    nonFunctional: string[]
  }
  rubric: {
    required: string[]
    recommended: string[]
    connections: Array<{ from: string; to: string }>
  }
}

export interface DesignNode {
  id: string
  type: 'componentNode'
  position: { x: number; y: number }
  data: {
    label: string
    category: string
    color: string
  } & Record<string, unknown>
}

export interface DesignEdge {
  id: string
  source: string
  target: string
}

export interface GradeResponse {
  score: number
  strengths: string[]
  missing: string[]
  feedback: string
}
