import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getQuestion } from '@/lib/questions'
import { buildGradingPrompt, parseGradingResponse } from '@/lib/grading'
import { DesignEdge } from '@/lib/types'
import { Node } from '@xyflow/react'
import { gradeRatelimit } from '@/lib/ratelimit'

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const { success } = await gradeRatelimit.limit(ip)
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

  const { questionId, nodes, edges } = body as Record<string, unknown>

  if (typeof questionId !== 'string') {
    return NextResponse.json({ error: 'Missing questionId' }, { status: 400 })
  }

  const question = getQuestion(questionId)
  if (!question) {
    return NextResponse.json({ error: 'Unknown question' }, { status: 400 })
  }

  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    return NextResponse.json({ error: 'Invalid nodes or edges' }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Grading service not configured' }, { status: 500 })
  }

  const prompt = buildGradingPrompt(question, nodes as Node[], edges as DesignEdge[])

  try {
    const groq = new Groq({ apiKey })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })
    const raw = completion.choices[0]?.message?.content ?? ''
    const gradeResponse = parseGradingResponse(raw)
    return NextResponse.json(gradeResponse)
  } catch {
    return NextResponse.json(
      {
        score: 0,
        strengths: [],
        missing: ['Grading service error — please try again'],
        feedback: 'An error occurred while contacting the grading service. Please try again.',
      },
      { status: 200 }
    )
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
