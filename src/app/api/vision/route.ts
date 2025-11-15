import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Você é um assistente especializado em extrair receitas de imagens. Analise esta imagem e extraia TODAS as informações da receita. Retorne um JSON com os seguintes campos: "title" (título da receita), "ingredients" (lista de ingredientes, um por linha), "instructions" (modo de preparo completo). Se a imagem não contiver uma receita, retorne uma mensagem explicando o que você vê.',
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    const content = response.choices[0].message.content || ''
    
    // Try to parse as JSON first
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          title: parsed.title || 'Receita da Imagem',
          ingredients: parsed.ingredients || '',
          text: parsed.instructions || content,
        })
      }
    } catch {
      // If not JSON, return as plain text
    }

    return NextResponse.json({
      title: 'Receita da Imagem',
      text: content,
      ingredients: '',
    })
  } catch (error) {
    console.error('Erro ao processar imagem:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a imagem' },
      { status: 500 }
    )
  }
}
