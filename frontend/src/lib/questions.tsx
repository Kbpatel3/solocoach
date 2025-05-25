export const fallbackQuestions = [
    "What challenged your patience today?",
    "What are you grateful for right now?",
    "What's something you avoided but want to face?",
    "What's one small win you had today?",
    "What energized you unexpectedly?",
    "What lesson did you relearn today?",
    "What's one kind thing you did (or could have done)?"
]

export async function getWeeklyQuestions(): Promise<string[]> {
  try {
    const res = await fetch('http://localhost:5000/api/questions', {
      method: 'POST'
    })

    const data = await res.json()

    if (Array.isArray(data.questions) && data.questions.length === 7) {
      return data.questions
    }

    return fallbackQuestions
  } catch (error) {
    console.error('Error fetching GPT questions, using fallback.', error)
    return fallbackQuestions
  }
}