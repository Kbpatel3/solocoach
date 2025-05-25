'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { db, ReflectionEntry } from '@/lib/db'
import Link from 'next/link'

function Countdown() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)

      const diff = midnight.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-block px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-full animate-pulse">
      ⏳ New question in {timeLeft}
    </div>
  )
}

export default function Home() {
  const [response, setResponse] = useState('')
  const [quote, setQuote] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const question = "🧘 What's something you handled better today than yesterday?"

  useEffect(() => {
    const checkToday = async () => {
      const existing: ReflectionEntry | undefined = await db.reflections
        .where('date')
        .equals(today)
        .first()

      if (existing) {
        setSubmitted(true)
        setResponse(existing.response)
        setQuote(existing.quote)
      }
    }

    checkToday()
  }, [today])

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection: response }),
      })

      const data = await res.json()
      const generatedQuote = data.quote || 'Stay strong and reflective. 🌱'
      setQuote(generatedQuote)

      await db.reflections.add({
        date: today,
        response,
        quote: generatedQuote,
      })

      setSubmitted(true)
    } catch (error) {
      console.error('Submission failed', error)
      setQuote('⚠️ Failed to generate quote. Try again later.')
      setSubmitted(true)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl space-y-6 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold">{question}</h1>
          {submitted && <Countdown />}
        </div>

        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your reflection here..."
          disabled={submitted}
          className="bg-white text-black min-h-[120px] focus:ring focus:ring-slate-300"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={handleSubmit}
              disabled={loading || submitted || response.trim() === ''}
              className="w-full"
            >
              {loading ? 'Thinking...' : submitted ? 'Already Submitted' : 'Submit Reflection'}
            </Button>
          </DialogTrigger>

          {submitted && (
            <DialogContent className="text-white bg-slate-900 border border-slate-700">
              <p className="text-lg font-semibold mb-2">✨ AI Quote:</p>
              <blockquote className="italic text-slate-300">&quot;{quote}&quot;</blockquote>
            </DialogContent>
          )}
        </Dialog>

        <div className="pt-2 text-center">
          <Link
            href="/responses"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            View past reflections →
          </Link>
        </div>
      </div>
    </main>
  )
}
