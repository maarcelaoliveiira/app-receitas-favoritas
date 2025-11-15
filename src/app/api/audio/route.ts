import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json()

    if (!audio) {
      return NextResponse.json(
        { error: 'Áudio não fornecido' },
        { status: 400 }
      )
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio.split(',')[1], 'base64')

    // Use OpenAI Whisper API for transcription
    const OpenAI = require('openai')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Create a File object from buffer
    const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'pt',
      prompt: 'Esta é uma receita culinária em português brasileiro com ingredientes e modo de preparo.'
    })

    const transcribedText = transcription.text

    // Now use GPT to structure the recipe
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em organizar receitas. Extraia as informações e retorne um JSON com: title, ingredients (array), instructions, prepTime, servings, category.'
        },
        {
          role: 'user',
          content: `Organize esta receita em formato estruturado: ${transcribedText}`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const recipeData = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      title: recipeData.title || 'Receita do Áudio',
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || transcribedText,
      prepTime: recipeData.prepTime || '30 min',
      servings: recipeData.servings || '4 porções',
      category: recipeData.category || 'Diversos',
      transcription: transcribedText
    })
  } catch (error) {
    console.error('Erro ao processar áudio:', error)
    return NextResponse.json(
      { error: 'Erro ao processar o áudio' },
      { status: 500 }
    )
  }
}
