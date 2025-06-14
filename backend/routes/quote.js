const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

router.post('/', async (req, res) => {
  const { reflection } = req.body
  if (!reflection) return res.status(400).json({ error: 'Reflection is required' })

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
            content: `Generate a motivational quote based on this reflection:\n"${reflection}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      }),
    })

    const data = await response.json()
    const quote = data.choices?.[0]?.message?.content?.trim()

    if (!quote) throw new Error('No quote returned')
    return res.json({ quote })
  } catch (err) {
    console.error('OpenRouter error:', err)
    return res.status(500).json({ error: 'Quote generation failed' })
  }
})

module.exports = router
