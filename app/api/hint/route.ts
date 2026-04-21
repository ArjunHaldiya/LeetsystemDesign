import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getQuestion } from '@/lib/questions'
import { Node } from '@xyflow/react'
import { hintRatelimit } from '@/lib/ratelimit'

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const { success } = await hintRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { questionId, nodes } = body as Record<string, unknown>

  if (typeof questionId !== 'string') {
    return NextResponse.json({ error: 'Missing questionId' }, { status: 400 })
  }

  const question = getQuestion(questionId)
  if (!question) {
    return NextResponse.json({ error: 'Unknown question' }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 500 })
  }

  const nodeLabels = Array.isArray(nodes)
    ? (nodes as Node[]).map((n) => (n.data as { label: string }).label).join(', ')
    : 'none'

  const requiredMissing = question.rubric.required.filter(
    (r) => !nodeLabels.toLowerCase().includes(r.toLowerCase())
  )
  const recommendedMissing = question.rubric.recommended.filter(
    (r) => !nodeLabels.toLowerCase().includes(r.toLowerCase())
  )

  const prompt = `You are helping a candidate practice a system design interview.

Question: ${question.title}

The ideal solution requires: ${question.rubric.required.join(', ')}
The ideal solution also benefits from (optional but valuable): ${question.rubric.recommended.join(', ')}

The candidate currently has these components: ${nodeLabels || 'none'}
Components still missing from required list: ${requiredMissing.length ? requiredMissing.join(', ') : 'none — all required components present'}
Optional components not yet added: ${recommendedMissing.length ? recommendedMissing.join(', ') : 'none'}

Give a single, specific, actionable hint (1-2 sentences) that nudges them toward what is still missing or weak. If all required components are present, focus on connections between them or scalability concerns. Do not suggest components they already have. Do not use markdown. Do not start with "Hint:".`

  try {
    const groq = new Groq({ apiKey })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    })
    const hint = completion.choices[0]?.message?.content?.trim() ?? ''
    return NextResponse.json({ hint })
  } catch {
    return NextResponse.json(
      { hint: 'Think about what happens when a single server goes down — how does your design handle that?' },
      { status: 200 }
    )
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
