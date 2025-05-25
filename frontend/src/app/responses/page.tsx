'use client'

import { useEffect, useState } from 'react'
import { db, ReflectionEntry } from '@/lib/db'

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
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">📜 Your Reflections</h1>

        {entries.length === 0 ? (
          <p className="text-center text-slate-400">No reflections yet.</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-2"
            >
              <p className="text-sm text-slate-400">🗓 {entry.date}</p>
              <p className="text-base text-white">📝 {entry.response}</p>
              <blockquote className="italic text-slate-300">✨ &quot;{entry.quote}&quot;</blockquote>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
