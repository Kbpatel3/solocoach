const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

router.post('/', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Give me 7 unique daily reflection questions (1 per day) that encourage self-awareness and personal growth. Respond as a numbered list, no extra commentary.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    const data = await response.json()

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenRouter")
    }

    const raw = data.choices[0].message.content
    const questions = raw
      .split('\n')
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((q) => q.length > 10)

    return res.json({ questions })
  } catch (err) {
    console.error('Failed to fetch questions from OpenRouter:', err)
    return res.status(500).json({ error: 'fallback' })
  }
})

module.exports = router
