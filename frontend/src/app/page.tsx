'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { db, ReflectionEntry } from '@/lib/db';

export default function Home() {
  const [response, setResponse] = useState('');
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const question = "🧘 What's something you handled better today than yesterday?" // TODO This will call a function to get the daily question later

  // Check if the user has already submitted a reflection for today
  useEffect(() => {
    const checkToday = async () => {
      const existing: ReflectionEntry | undefined = await db.reflections
        .where("date")
        .equals(today)
        .first();

      if (existing) {
        setSubmitted(true);
        setResponse(existing.response);
        setQuote(existing.quote);
      }
    }

    checkToday();
  }, [today])

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/quotes", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflection: response }),
      });

      const data = await res.json();
      const generatedQuote = data.quote || "Stay strong and reflective. 🌱"
      setQuote(generatedQuote);

      await db.reflections.add({
        date: today,
        response,
        quote: generatedQuote,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed", error);
      setQuote("⚠️ Failed to generate quote. Try again later.")
      setSubmitted(true);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center">{question}</h1>

        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your reflection here..."
          disabled={submitted}
          className="bg-white text-black min-h-[120px]"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={handleSubmit}
              disabled={loading || submitted || response.trim() === ""}
              className="w-full"
            >
              {loading ? "Thinking..." : "Submit Reflection"}
            </Button>
          </DialogTrigger>
          {submitted && (
            <DialogContent className="text-white bg-slate-900 border-slate-700">
              <p className="text-lg font-semibold mb-2">✨ AI Quote:</p>
              <blockquote className="italic text-slate-300">&quot;{quote}&quot;</blockquote>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </main>
  )
}