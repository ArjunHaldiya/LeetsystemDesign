'use client'

import { GradeResponse } from '@/lib/types'

interface ScorePanelProps {
  result: GradeResponse
  onClose: () => void
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'
  const label = score >= 80 ? 'Great' : score >= 60 ? 'Good' : 'Needs Work'

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="#27272a" strokeWidth="6" />
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-zinc-100">{score}</span>
        </div>
      </div>
      <div>
        <div className="text-zinc-100 font-semibold text-sm">{label}</div>
        <div className="text-zinc-500 text-xs mt-0.5">{score}/100 points</div>
      </div>
    </div>
  )
}

export function ScorePanel({ result, onClose }: ScorePanelProps) {
  const { score, strengths, missing, feedback } = result

  return (
    <div className="border-t border-zinc-800/60 flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <ScoreRing score={score} />
        <button
          onClick={onClose}
          className="text-zinc-600 hover:text-zinc-400 text-lg leading-none mt-0.5 focus:outline-none transition-colors"
          aria-label="Close results"
        >
          ×
        </button>
      </div>

      {/* Feedback */}
      <p className="text-zinc-500 text-xs leading-relaxed border-l-2 border-zinc-700 pl-3">
        {feedback}
      </p>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div>
          <h4 className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest mb-2">
            Strengths
          </h4>
          <ul className="flex flex-col gap-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing */}
      {missing.length > 0 && (
        <div>
          <h4 className="text-rose-400 text-[10px] font-semibold uppercase tracking-widest mb-2">
            Missing / Gaps
          </h4>
          <ul className="flex flex-col gap-1.5">
            {missing.map((m, i) => (
              <li key={i} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                <span className="text-rose-500 shrink-0 mt-0.5">✗</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
