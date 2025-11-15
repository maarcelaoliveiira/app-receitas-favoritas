// Base de dados inicial com receitas brasileiras populares
export interface RecipeData {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  prepTime: string
  servings: string
  category: string
  imageUrl?: string
  source: string
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

export const initialRecipes: RecipeData[] = [
  {
    id: "1",
    title: "Feijoada Completa",
    ingredients: [
      "500g de feijão preto",
      "300g de carne seca",
      "200g de linguiça calabresa",
      "200g de bacon",
      "150g de costela de porco",
      "2 folhas de louro",
      "4 dentes de alho",
      "1 cebola grande",
      "Sal a gosto"
    ],
    instructions: "Deixe o feijão de molho na véspera. Cozinhe as carnes separadamente. Refogue alho e cebola, adicione o feijão e as carnes. Cozinhe por 2 horas em fogo baixo. Sirva com arroz, couve e laranja.",
    prepTime: "3 horas",
    servings: "8 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 520,
      protein: 35,
      carbs: 45,
      fat: 22,
      fiber: 12
    }
  },
  {
    id: "2",
    title: "Brigadeiro Tradicional",
    ingredients: [
      "1 lata de leite condensado",
      "2 colheres de sopa de chocolate em pó",
      "1 colher de sopa de manteiga",
      "Chocolate granulado para decorar"
    ],
    instructions: "Em uma panela, misture o leite condensado, chocolate em pó e manteiga. Cozinhe em fogo médio, mexendo sempre até desgrudar do fundo. Deixe esfriar, faça bolinhas e passe no granulado.",
    prepTime: "30 minutos",
    servings: "30 unidades",
    category: "Sobremesa",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 85,
      protein: 2,
      carbs: 14,
      fat: 3,
      fiber: 0.5
    }
  },
  {
    id: "3",
    title: "Pão de Queijo Mineiro",
    ingredients: [
      "500g de polvilho azedo",
      "1 xícara de leite",
      "1/2 xícara de óleo",
      "2 ovos",
      "200g de queijo minas ralado",
      "1 colher de chá de sal"
    ],
    instructions: "Ferva o leite com óleo e sal. Despeje sobre o polvilho e misture. Adicione os ovos e o queijo. Faça bolinhas e asse em forno pré-aquecido a 180°C por 25 minutos.",
    prepTime: "45 minutos",
    servings: "20 unidades",
    category: "Lanche",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 120,
      protein: 4,
      carbs: 18,
      fat: 4,
      fiber: 0.3
    }
  },
  {
    id: "4",
    title: "Moqueca de Peixe Capixaba",
    ingredients: [
      "1kg de peixe (badejo ou robalo)",
      "3 tomates maduros",
      "1 cebola grande",
      "1 pimentão verde",
      "200ml de leite de coco",
      "Coentro a gosto",
      "Azeite de dendê",
      "Sal e pimenta"
    ],
    instructions: "Em uma panela de barro, faça camadas de cebola, tomate, pimentão e peixe temperado. Regue com azeite de dendê e leite de coco. Cozinhe em fogo baixo por 30 minutos. Finalize com coentro.",
    prepTime: "50 minutos",
    servings: "6 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 380,
      protein: 42,
      carbs: 12,
      fat: 18,
      fiber: 3
    }
  },
  {
    id: "5",
    title: "Coxinha de Frango",
    ingredients: [
      "500g de peito de frango",
      "2 xícaras de farinha de trigo",
      "2 xícaras de caldo de frango",
      "2 colheres de sopa de manteiga",
      "1 cebola picada",
      "2 dentes de alho",
      "Farinha de rosca",
      "2 ovos batidos"
    ],
    instructions: "Cozinhe e desfie o frango. Refogue com alho e cebola. Prepare a massa com caldo e farinha. Modele as coxinhas, passe no ovo e farinha de rosca. Frite em óleo quente.",
    prepTime: "1 hora 30 minutos",
    servings: "25 unidades",
    category: "Lanche",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 95,
      protein: 6,
      carbs: 12,
      fat: 3,
      fiber: 0.8
    }
  },
  {
    id: "6",
    title: "Arroz de Carreteiro",
    ingredients: [
      "500g de carne seca",
      "3 xícaras de arroz",
      "1 cebola grande",
      "3 dentes de alho",
      "2 tomates",
      "Cebolinha verde",
      "Sal e pimenta"
    ],
    instructions: "Dessalgue e cozinhe a carne seca. Desfie e reserve. Refogue alho, cebola e tomate. Adicione a carne e o arroz. Acrescente água e cozinhe até secar. Finalize com cebolinha.",
    prepTime: "1 hora",
    servings: "6 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 52,
      fat: 12,
      fiber: 2
    }
  },
  {
    id: "7",
    title: "Pudim de Leite Condensado",
    ingredients: [
      "1 lata de leite condensado",
      "2 latas de leite (use a lata de leite condensado)",
      "3 ovos",
      "1 xícara de açúcar para a calda"
    ],
    instructions: "Faça a calda com açúcar até caramelizar. Bata no liquidificador leite condensado, leite e ovos. Despeje na forma caramelizada. Asse em banho-maria por 1 hora a 180°C.",
    prepTime: "1 hora 30 minutos",
    servings: "10 porções",
    category: "Sobremesa",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 245,
      protein: 8,
      carbs: 38,
      fat: 7,
      fiber: 0
    }
  },
  {
    id: "8",
    title: "Tapioca Recheada",
    ingredients: [
      "1 xícara de goma de tapioca",
      "Queijo coalho ralado",
      "Coco ralado",
      "Leite condensado",
      "Manteiga"
    ],
    instructions: "Hidrate a goma por 5 minutos. Aqueça uma frigideira antiaderente. Espalhe a goma formando um disco. Quando firmar, adicione o recheio de sua preferência. Dobre ao meio e sirva.",
    prepTime: "15 minutos",
    servings: "2 unidades",
    category: "Café da Manhã",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 180,
      protein: 5,
      carbs: 28,
      fat: 6,
      fiber: 1
    }
  },
  {
    id: "9",
    title: "Vatapá Baiano",
    ingredients: [
      "500g de camarão",
      "200g de pão amanhecido",
      "200ml de leite de coco",
      "100g de amendoim torrado",
      "100g de castanha de caju",
      "2 cebolas",
      "3 dentes de alho",
      "Azeite de dendê",
      "Gengibre e pimenta"
    ],
    instructions: "Hidrate o pão no leite de coco. Bata com amendoim e castanha. Refogue alho, cebola e camarão. Adicione a pasta de pão e cozinhe mexendo. Finalize com dendê.",
    prepTime: "1 hora",
    servings: "8 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 340,
      protein: 22,
      carbs: 25,
      fat: 18,
      fiber: 4
    }
  },
  {
    id: "10",
    title: "Bolo de Cenoura com Cobertura de Chocolate",
    ingredients: [
      "3 cenouras médias",
      "4 ovos",
      "2 xícaras de açúcar",
      "1 xícara de óleo",
      "2 xícaras de farinha de trigo",
      "1 colher de sopa de fermento",
      "200g de chocolate meio amargo",
      "1 caixa de creme de leite"
    ],
    instructions: "Bata no liquidificador cenoura, ovos, açúcar e óleo. Misture farinha e fermento. Asse a 180°C por 40 minutos. Para a cobertura, derreta chocolate com creme de leite e cubra o bolo.",
    prepTime: "1 hora",
    servings: "12 porções",
    category: "Sobremesa",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 320,
      protein: 6,
      carbs: 42,
      fat: 15,
      fiber: 2
    }
  },
  {
    id: "11",
    title: "Acarajé",
    ingredients: [
      "500g de feijão fradinho",
      "1 cebola grande",
      "Sal a gosto",
      "Azeite de dendê para fritar",
      "Vatapá, caruru e camarão para recheio"
    ],
    instructions: "Deixe o feijão de molho e retire a casca. Bata com cebola até formar uma pasta. Tempere com sal. Frite em azeite de dendê bem quente. Recheie com vatapá, caruru e camarão.",
    prepTime: "2 horas",
    servings: "15 unidades",
    category: "Lanche",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 22,
      fat: 7,
      fiber: 5
    }
  },
  {
    id: "12",
    title: "Escondidinho de Carne Seca",
    ingredients: [
      "500g de carne seca",
      "1kg de mandioca",
      "200g de queijo mussarela",
      "100g de manteiga",
      "1 cebola",
      "2 dentes de alho",
      "Leite"
    ],
    instructions: "Cozinhe e desfie a carne seca. Refogue com alho e cebola. Cozinhe a mandioca e faça um purê com manteiga e leite. Monte em camadas: purê, carne, queijo. Gratine no forno.",
    prepTime: "1 hora 30 minutos",
    servings: "8 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 450,
      protein: 32,
      carbs: 38,
      fat: 20,
      fiber: 3
    }
  },
  {
    id: "13",
    title: "Quindim",
    ingredients: [
      "10 gemas",
      "1 xícara de açúcar",
      "100g de coco ralado",
      "50g de manteiga",
      "1 colher de sopa de farinha de trigo"
    ],
    instructions: "Bata as gemas com açúcar. Adicione coco, manteiga derretida e farinha. Despeje em forminhas caramelizadas. Asse em banho-maria a 180°C por 40 minutos.",
    prepTime: "1 hora",
    servings: "12 unidades",
    category: "Sobremesa",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 165,
      protein: 3,
      carbs: 22,
      fat: 8,
      fiber: 1
    }
  },
  {
    id: "14",
    title: "Baião de Dois",
    ingredients: [
      "2 xícaras de arroz",
      "1 xícara de feijão de corda cozido",
      "200g de queijo coalho",
      "100g de bacon",
      "1 cebola",
      "2 dentes de alho",
      "Coentro e cebolinha"
    ],
    instructions: "Frite o bacon. Refogue alho e cebola. Adicione o arroz e refogue. Acrescente água e cozinhe. Quando quase pronto, adicione o feijão e o queijo em cubos. Finalize com coentro.",
    prepTime: "45 minutos",
    servings: "6 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 48,
      fat: 14,
      fiber: 6
    }
  },
  {
    id: "15",
    title: "Pastel de Feira",
    ingredients: [
      "500g de farinha de trigo",
      "1 colher de sopa de cachaça",
      "1 colher de chá de sal",
      "Água morna",
      "Recheio: carne moída, queijo, palmito"
    ],
    instructions: "Misture farinha, sal, cachaça e água até formar uma massa lisa. Deixe descansar por 30 minutos. Abra a massa, recheie e corte em retângulos. Frite em óleo quente.",
    prepTime: "1 hora",
    servings: "20 unidades",
    category: "Lanche",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 145,
      protein: 6,
      carbs: 18,
      fat: 6,
      fiber: 1
    }
  },
  {
    id: "16",
    title: "Bobó de Camarão",
    ingredients: [
      "500g de camarão",
      "500g de mandioca",
      "200ml de leite de coco",
      "1 cebola",
      "3 dentes de alho",
      "2 tomates",
      "Azeite de dendê",
      "Coentro"
    ],
    instructions: "Cozinhe a mandioca e bata com leite de coco. Refogue alho, cebola, tomate e camarão. Adicione o creme de mandioca e cozinhe. Finalize com dendê e coentro.",
    prepTime: "50 minutos",
    servings: "6 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 320,
      protein: 24,
      carbs: 28,
      fat: 14,
      fiber: 3
    }
  },
  {
    id: "17",
    title: "Beijinho de Coco",
    ingredients: [
      "1 lata de leite condensado",
      "2 colheres de sopa de manteiga",
      "100g de coco ralado",
      "Coco ralado para decorar",
      "Cravo da índia"
    ],
    instructions: "Misture leite condensado, manteiga e coco em uma panela. Cozinhe mexendo até desgrudar do fundo. Deixe esfriar, faça bolinhas, passe no coco e decore com cravo.",
    prepTime: "30 minutos",
    servings: "30 unidades",
    category: "Sobremesa",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 90,
      protein: 2,
      carbs: 13,
      fat: 4,
      fiber: 0.8
    }
  },
  {
    id: "18",
    title: "Virado à Paulista",
    ingredients: [
      "500g de feijão",
      "300g de linguiça",
      "4 ovos",
      "200g de torresmo",
      "3 xícaras de farinha de mandioca",
      "Couve refogada",
      "Arroz branco"
    ],
    instructions: "Cozinhe o feijão e refogue com alho. Frite a linguiça e o torresmo. Prepare a farofa com a farinha. Frite os ovos. Monte o prato com arroz, feijão, farofa, linguiça, torresmo, ovo e couve.",
    prepTime: "1 hora 30 minutos",
    servings: "4 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 680,
      protein: 35,
      carbs: 65,
      fat: 32,
      fiber: 12
    }
  },
  {
    id: "19",
    title: "Mousse de Maracujá",
    ingredients: [
      "1 lata de leite condensado",
      "1 lata de creme de leite",
      "1 xícara de suco de maracujá concentrado",
      "1 envelope de gelatina incolor"
    ],
    instructions: "Dissolva a gelatina conforme instruções. Bata no liquidificador leite condensado, creme de leite e suco. Adicione a gelatina e bata. Despeje em taças e leve à geladeira por 4 horas.",
    prepTime: "4 horas 15 minutos",
    servings: "8 porções",
    category: "Sobremesa",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 220,
      protein: 5,
      carbs: 32,
      fat: 9,
      fiber: 1
    }
  },
  {
    id: "20",
    title: "Empadão de Frango",
    ingredients: [
      "500g de peito de frango",
      "3 xícaras de farinha de trigo",
      "200g de manteiga",
      "2 ovos",
      "1 cebola",
      "2 tomates",
      "Azeitonas e ervilhas",
      "Sal e temperos"
    ],
    instructions: "Prepare a massa com farinha, manteiga e ovos. Cozinhe e desfie o frango. Refogue com cebola, tomate, azeitonas e ervilhas. Forre uma forma com a massa, adicione o recheio e cubra. Asse a 180°C por 40 minutos.",
    prepTime: "1 hora 30 minutos",
    servings: "10 porções",
    category: "Almoço",
    source: "Receitas Brasileiras",
    nutrition: {
      calories: 380,
      protein: 22,
      carbs: 35,
      fat: 18,
      fiber: 3
    }
  }
]
