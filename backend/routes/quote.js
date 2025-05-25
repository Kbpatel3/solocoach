const express = require('express')
const dotenv = require('dotenv')
const OpenAI = require('openai')
const router = express.Router()

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

router.post('/', async (req, res) => {
  const { reflection } = req.body

  if (!reflection) {
    return res.status(400).json({ error: 'Reflection is required' })
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Generate a motivational quote based on this reflection:\n"${reflection}"`,
        },
      ],
      max_tokens: 60,
    })

    const quote = chatResponse.choices[0].message.content.trim()
    return res.json({ quote })
  } catch (err) {
    console.error('OpenAI error:', err)
    res.status(500).json({ error: 'Failed to generate quote' })
  }
})

module.exports = router
