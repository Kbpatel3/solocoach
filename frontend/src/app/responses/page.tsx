'use client'

import { useEffect, useState } from 'react'
import { db, ReflectionEntry } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ResponsesPage() {
  const [entries, setEntries] = useState<ReflectionEntry[]>([])

  useEffect(() => {
    const fetchReflections = async () => {
      const data = await db.reflections.orderBy('date').reverse().toArray()
      setEntries(data)
    }

    fetchReflections()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-4 mb-6">
            <Link
                href="/"
                className="inline-flex items-center text-slate-400 hover:text-white text-sm gap-1"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Today
            </Link>

            <h1 className="text-2xl font-semibold text-center">
                📜 Your Reflections
            </h1>
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="text-center text-slate-400">No reflections yet.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur shadow-lg space-y-3"
              >
                <p className="text-sm text-slate-400">🗓 {entry.date}</p>
                <div className="text-white whitespace-pre-line">📝 {entry.response}</div>
                <blockquote className="text-sm italic text-slate-300 border-l-4 border-slate-700 pl-4">
                  ✨ “{entry.quote}”
                </blockquote>
              </div>
            ))}
          </div>
        )}

        <div className="pt-1 text-center">
          <a
            href="https://forms.gle/pyifZJPeAas2atoF6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-white transition-colors underline"
          >
            Submit feedback or suggest a feature →
          </a>
        </div>
      </div>
    </main>
  )
}
