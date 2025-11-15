// Função para calcular informações nutricionais baseadas nos ingredientes
export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

// Base de dados nutricional simplificada (valores por 100g)
const nutritionDatabase: Record<string, NutritionInfo> = {
  // Carnes
  'frango': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  'carne': { calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0 },
  'peixe': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0 },
  'camarão': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  'bacon': { calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0 },
  'linguiça': { calories: 301, protein: 13, carbs: 1.5, fat: 27, fiber: 0 },
  
  // Grãos e cereais
  'arroz': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  'feijão': { calories: 127, protein: 8.7, carbs: 23, fat: 0.5, fiber: 7.6 },
  'farinha': { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7 },
  'macarrão': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
  
  // Laticínios
  'leite': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0 },
  'queijo': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
  'manteiga': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
  'creme de leite': { calories: 345, protein: 2.1, carbs: 2.8, fat: 37, fiber: 0 },
  
  // Vegetais
  'tomate': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  'cebola': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
  'alho': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
  'cenoura': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  'batata': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.1 },
  
  // Outros
  'ovo': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  'açúcar': { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
  'óleo': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'chocolate': { calories: 546, protein: 4.9, carbs: 61, fat: 31, fiber: 7 },
  'leite condensado': { calories: 321, protein: 7.9, carbs: 54, fat: 8.4, fiber: 0 },
}

export function calculateNutrition(ingredients: string[]): NutritionInfo {
  const nutrition: NutritionInfo = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  }

  ingredients.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase()
    
    // Procura por palavras-chave no ingrediente
    Object.keys(nutritionDatabase).forEach(key => {
      if (lowerIngredient.includes(key)) {
        const data = nutritionDatabase[key]
        
        // Extrai quantidade aproximada (simplificado)
        let multiplier = 0.5 // valor padrão
        
        if (lowerIngredient.includes('kg') || lowerIngredient.includes('quilo')) {
          multiplier = 5
        } else if (lowerIngredient.includes('g') && !lowerIngredient.includes('kg')) {
          const match = lowerIngredient.match(/(\d+)\s*g/)
          if (match) {
            multiplier = parseInt(match[1]) / 100
          }
        } else if (lowerIngredient.includes('xícara')) {
          multiplier = 1.2
        } else if (lowerIngredient.includes('colher')) {
          multiplier = 0.15
        } else if (lowerIngredient.includes('lata')) {
          multiplier = 2
        }
        
        nutrition.calories += data.calories * multiplier
        nutrition.protein += data.protein * multiplier
        nutrition.carbs += data.carbs * multiplier
        nutrition.fat += data.fat * multiplier
        nutrition.fiber += data.fiber * multiplier
      }
    })
  })

  // Arredonda os valores
  return {
    calories: Math.round(nutrition.calories),
    protein: Math.round(nutrition.protein * 10) / 10,
    carbs: Math.round(nutrition.carbs * 10) / 10,
    fat: Math.round(nutrition.fat * 10) / 10,
    fiber: Math.round(nutrition.fiber * 10) / 10
  }
}

export function formatNutrition(nutrition: NutritionInfo): string {
  return `
Calorias: ${nutrition.calories} kcal
Proteínas: ${nutrition.protein}g
Carboidratos: ${nutrition.carbs}g
Gorduras: ${nutrition.fat}g
Fibras: ${nutrition.fiber}g
  `.trim()
}
