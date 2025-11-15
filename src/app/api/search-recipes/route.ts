import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Consulta não fornecida' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em receitas culinárias. Quando o usuário buscar por uma receita, você deve retornar 3-5 receitas relevantes em formato JSON. Cada receita deve ter: "title" (nome da receita), "source" (fonte fictícia como "Blog Culinário", "Chef Renomado", etc), "ingredients" (array de ingredientes), "instructions" (modo de preparo detalhado), "category" (categoria como Sobremesa, Almoço, Jantar, etc), "imageUrl" (URL de imagem do Unsplash relacionada à receita). Use URLs reais do Unsplash no formato: https://images.unsplash.com/photo-[ID]?w=400&h=300&fit=crop. Retorne APENAS o JSON array, sem texto adicional.',
        },
        {
          role: 'user',
          content: `Busque receitas sobre: ${query}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const content = response.choices[0].message.content || '[]'
    
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const recipes = JSON.parse(jsonMatch[0])
        return NextResponse.json({ recipes })
      }
    } catch (error) {
      console.error('Erro ao parsear JSON:', error)
    }

    // Fallback: return empty array
    return NextResponse.json({ recipes: [] })
  } catch (error) {
    console.error('Erro ao buscar receitas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar receitas' },
      { status: 500 }
    )
  }
}
