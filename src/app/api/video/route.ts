import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { video } = await request.json()

    if (!video) {
      return NextResponse.json(
        { error: 'Vídeo não fornecido' },
        { status: 400 }
      )
    }

    // Convert base64 to buffer
    const videoBuffer = Buffer.from(video.split(',')[1], 'base64')

    const OpenAI = require('openai')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Extract audio from video and transcribe
    const videoFile = new File([videoBuffer], 'video.mp4', { type: 'video/mp4' })

    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: 'whisper-1',
      language: 'pt',
      prompt: 'Esta é uma receita culinária em português brasileiro com ingredientes e modo de preparo.'
    })

    const transcribedText = transcription.text

    // Structure the recipe with GPT
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
      title: recipeData.title || 'Receita do Vídeo',
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || transcribedText,
      prepTime: recipeData.prepTime || '30 min',
      servings: recipeData.servings || '4 porções',
      category: recipeData.category || 'Diversos',
      transcription: transcribedText
    })
  } catch (error) {
    console.error('Erro ao processar vídeo:', error)
    return NextResponse.json(
      { error: 'Erro ao processar o vídeo' },
      { status: 500 }
    )
  }
}
