import { Question, DesignEdge, GradeResponse } from './types'
import { Node } from '@xyflow/react'

export function buildGradingPrompt(
  question: Question,
  nodes: Node[],
  edges: DesignEdge[]
): string {
  const nodeLabels = nodes.map((n) => (n.data as { label: string }).label).join(', ')

  const edgeDescriptions = edges
    .map((e) => {
      const src = nodes.find((n) => n.id === e.source)
      const tgt = nodes.find((n) => n.id === e.target)
      const srcLabel = src ? (src.data as { label: string }).label : e.source
      const tgtLabel = tgt ? (tgt.data as { label: string }).label : e.target
      return `${srcLabel} → ${tgtLabel}`
    })
    .join(', ')

  const functionalReqs = question.requirements.functional.join('; ')
  const nonFunctionalReqs = question.requirements.nonFunctional.join('; ')
  const requiredComponents = question.rubric.required.join(', ')
  const recommendedComponents = question.rubric.recommended.join(', ')
  const keyConnections = question.rubric.connections
    .map((c) => `${c.from} → ${c.to}`)
    .join(', ')

  return `You are a senior software engineer evaluating a system design interview answer.

Question: ${question.title}
Functional Requirements: ${functionalReqs}
Non-Functional Requirements: ${nonFunctionalReqs}

The candidate's design includes these components: ${nodeLabels || 'none'}
With these connections: ${edgeDescriptions || 'none'}

The ideal design must include: ${requiredComponents}
The ideal design should also include: ${recommendedComponents}
Key expected connections: ${keyConnections}

Evaluate the design on correctness, completeness, and scalability. Score strictly — a design missing critical components should score below 60.

Return ONLY a JSON object with this exact shape:
{
  "score": <number 0-100>,
  "strengths": [<2-4 short strings describing what the candidate did well>],
  "missing": [<1-3 short strings of critical gaps or mistakes>],
  "feedback": "<one paragraph, 2-4 sentences, overall assessment>"
}

No markdown. No explanation. Only the JSON object.`
}

const fallbackResponse: GradeResponse = {
  score: 0,
  strengths: [],
  missing: ['Could not evaluate design — please try again'],
  feedback: 'An error occurred while evaluating your design. Please try again.',
}

export function parseGradingResponse(raw: string): GradeResponse {
  try {
    const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '')
    const parsed = JSON.parse(cleaned) as unknown

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>).score !== 'number' ||
      !Array.isArray((parsed as Record<string, unknown>).strengths) ||
      !Array.isArray((parsed as Record<string, unknown>).missing) ||
      typeof (parsed as Record<string, unknown>).feedback !== 'string'
    ) {
      return fallbackResponse
    }

    const obj = parsed as Record<string, unknown>
    return {
      score: Math.min(100, Math.max(0, obj.score as number)),
      strengths: (obj.strengths as unknown[]).filter((s): s is string => typeof s === 'string'),
      missing: (obj.missing as unknown[]).filter((s): s is string => typeof s === 'string'),
      feedback: obj.feedback as string,
    }
  } catch {
    return fallbackResponse
  }
}
