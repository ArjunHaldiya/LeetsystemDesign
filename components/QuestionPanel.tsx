'use client'

import { Question, Difficulty } from '@/lib/types'

interface QuestionPanelProps {
  question: Question
  nodeCount: number
  isGrading: boolean
  isHinting: boolean
  hint: string | null
  onRunTests: () => void
  onHint: () => void
  onShare: () => void
  shareToast: boolean
}

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
  medium: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
  hard: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
}

export function QuestionPanel({
  question,
  nodeCount,
  isGrading,
  isHinting,
  hint,
  onRunTests,
  onHint,
  onShare,
  shareToast,
}: QuestionPanelProps) {
  const canRunTests = nodeCount >= 2 && !isGrading

  return (
    <aside className="w-72 shrink-0 bg-zinc-950 border-l border-zinc-800/60 flex flex-col h-full overflow-y-auto">
      {/* Question header */}
      <div className="px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-zinc-600 text-xs font-medium">{question.company}</span>
          <span className="text-zinc-700">·</span>
          <span
            className={`text-xs font-medium border rounded-full px-2 py-0.5 capitalize ${difficultyStyles[question.difficulty]}`}
          >
            {question.difficulty}
          </span>
        </div>
        <h1 className="text-zinc-100 font-semibold text-sm leading-snug mb-2">{question.title}</h1>
        <p className="text-zinc-500 text-xs leading-relaxed">{question.description}</p>
      </div>

      {/* Requirements */}
      <div className="px-5 py-4 border-b border-zinc-800/60 flex flex-col gap-4">
        <div>
          <h2 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest mb-2.5">
            Functional
          </h2>
          <ul className="flex flex-col gap-1.5">
            {question.requirements.functional.map((req, i) => (
              <li key={i} className="text-zinc-400 text-xs flex gap-2 leading-relaxed">
                <span className="text-blue-500/60 shrink-0 mt-0.5">▸</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest mb-2.5">
            Non-Functional
          </h2>
          <ul className="flex flex-col gap-1.5">
            {question.requirements.nonFunctional.map((req, i) => (
              <li key={i} className="text-zinc-400 text-xs flex gap-2 leading-relaxed">
                <span className="text-zinc-600 shrink-0 mt-0.5">▸</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hint */}
      {hint && (
        <div className="mx-4 my-3 px-3.5 py-3 rounded-xl border border-amber-800/40 bg-amber-950/20">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-amber-400 text-[10px] font-semibold uppercase tracking-widest">Hint</span>
          </div>
          <p className="text-zinc-300 text-xs leading-relaxed">{hint}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto px-4 py-4 border-t border-zinc-800/60 flex flex-col gap-2">
        {nodeCount < 2 && (
          <p className="text-zinc-700 text-[10px] text-center mb-1">
            Add at least 2 components to run
          </p>
        )}

        {/* Run Tests — primary */}
        <button
          onClick={onRunTests}
          disabled={!canRunTests}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950
            disabled:bg-zinc-800/60 disabled:text-zinc-600 disabled:cursor-not-allowed
            enabled:bg-gray-600 enabled:hover:bg-gray-500 enabled:text-white enabled:shadow-[0_0_0_1px_rgba(96,165,250,0.2)] enabled:hover:shadow-[0_0_16px_rgba(59,130,246,0.3)]"
        >
          {isGrading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Grading…
            </span>
          ) : (
            'Run Tests'
          )}
        </button>

        {/* Hint — secondary amber tint */}
        <button
          onClick={onHint}
          disabled={isHinting}
          className="w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950
            disabled:opacity-40 disabled:cursor-not-allowed
            bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/60 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100"
        >
          {isHinting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-zinc-500 border-t-amber-400 animate-spin" />
              Thinking…
            </span>
          ) : (
            hint ? '↺ New Hint' : '💡 Hint'
          )}
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950
            bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
        >
          {shareToast ? '✓ Copied!' : '↗ Share'}
        </button>
      </div>
    </aside>
  )
}
