import { getQuestion } from '@/lib/questions'
import { PlaygroundClient } from './PlaygroundClient'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ questionId: string }>
}

export default async function PlaygroundPage({ params }: PageProps) {
  const { questionId } = await params
  const question = getQuestion(questionId)

  if (!question) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="text-zinc-100 text-xl font-semibold mb-2">Question not found</h1>
          <p className="text-zinc-500 text-sm mb-6">
            &quot;{questionId}&quot; doesn&apos;t match any available questions.
          </p>
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm focus:outline-none focus:underline"
          >
            ← Back to question list
          </Link>
        </div>
      </div>
    )
  }

  return <PlaygroundClient question={question} />
}
