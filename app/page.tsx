import Link from 'next/link'
import { questions } from '@/lib/questions'
import { Difficulty } from '@/lib/types'

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
  medium: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
  hard: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
}

const difficultyDot: Record<Difficulty, string> = {
  easy: 'bg-emerald-400',
  medium: 'bg-amber-400',
  hard: 'bg-rose-400',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Subtle radial glow at top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, #3b82f640, transparent)',
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 pt-20 pb-24">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 text-xs mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-powered feedback
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3 leading-tight">
            Design Dojo<br />
            <span className="text-zinc-400"> Leetcode for System Designs</span>
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-md">
            Build architecture diagrams visually and get detailed scored feedback.
          </p>
        </div>

        {/* Question list */}
        <div className="flex flex-col gap-3">
          <p className="text-zinc-600 text-xs font-medium uppercase tracking-widest mb-1">
            Questions available (More coming Soon!)
          </p>
          {questions.map((q, i) => (
            <Link
              key={q.id}
              href={`/playground/${q.id}`}
              className="group relative flex items-center justify-between p-5 bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-600 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950 hover:bg-zinc-800/60 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600 text-xs font-mono">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-600 text-xs">·</span>
                  <span className="text-zinc-500 text-xs font-medium">{q.company}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium border rounded-full px-2 py-0.5 ${difficultyStyles[q.difficulty]}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${difficultyDot[q.difficulty]}`} />
                    {q.difficulty}
                  </span>
                </div>
                <h2 className="text-zinc-100 font-semibold text-base group-hover:text-white transition-colors leading-snug">
                  {q.title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed">{q.description}</p>
              </div>
              <div className="ml-6 shrink-0 w-8 h-8 rounded-full border border-zinc-700 bg-zinc-800/60 flex items-center justify-center group-hover:border-zinc-500 group-hover:bg-zinc-700/60 transition-all">
                <span className="text-zinc-400 group-hover:text-zinc-200 text-sm transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-12 text-zinc-700 text-xs text-center">
          If you are seeing this, thank you for being my ginny pig
        </p>
      </div>
    </main>
  )
}
