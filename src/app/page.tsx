"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, BookOpen, ShoppingCart, Calendar, Home, Plus, Search, Heart, Clock, Users, ChefHat, Sparkles, X, Check, Share2, MessageCircle, Trash2, Edit2, Mic, Video, Flame, Apple, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { initialRecipes } from "@/lib/recipes-database"
import { calculateNutrition, formatNutrition, type NutritionInfo } from "@/lib/nutrition-calculator"

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  prepTime: string
  servings: string
  category: string
  imageUrl?: string
  source: string
  createdAt: string
  isFavorite?: boolean
  isPublic?: boolean
  author?: string
  likes?: number
  comments?: Comment[]
  nutrition?: NutritionInfo
  userCategories?: string[]
}

interface Comment {
  id: string
  author: string
  text: string
  createdAt: string
}

interface ShoppingItem {
  id: string
  name: string
  checked: boolean
  category: string
}

interface MealPlan {
  id: string
  date: string
  meal: string
  recipeId: string
  recipeName: string
}

export default function RecipeMeApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [databaseRecipes, setDatabaseRecipes] = useState<Recipe[]>([])
  const [communityRecipes, setCommunityRecipes] = useState<Recipe[]>([])
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [currentUser] = useState("Você")
  const [commentText, setCommentText] = useState("")
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedRecipeForCategory, setSelectedRecipeForCategory] = useState<Recipe | null>(null)
  const [userCategories, setUserCategories] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    prepTime: "",
    servings: "",
    category: "",
    imageUrl: "",
    source: ""
  })

  // Load initial database recipes
  useEffect(() => {
    const dbRecipes = initialRecipes.map(r => ({
      ...r,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isPublic: false,
      author: "RecipeBR",
      likes: Math.floor(Math.random() * 100),
      comments: []
    }))
    setDatabaseRecipes(dbRecipes)
  }, [])

  // Load data from localStorage
  useEffect(() => {
    const savedRecipes = localStorage.getItem("recipeme_recipes")
    const savedCommunity = localStorage.getItem("recipeme_community")
    const savedShopping = localStorage.getItem("recipeme_shopping")
    const savedMealPlans = localStorage.getItem("recipeme_mealplans")
    const savedCategories = localStorage.getItem("recipeme_categories")

    if (savedRecipes) setRecipes(JSON.parse(savedRecipes))
    if (savedCommunity) setCommunityRecipes(JSON.parse(savedCommunity))
    if (savedShopping) setShoppingList(JSON.parse(savedShopping))
    if (savedMealPlans) setMealPlans(JSON.parse(savedMealPlans))
    if (savedCategories) setUserCategories(JSON.parse(savedCategories))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("recipeme_recipes", JSON.stringify(recipes))
  }, [recipes])

  useEffect(() => {
    localStorage.setItem("recipeme_community", JSON.stringify(communityRecipes))
  }, [communityRecipes])

  useEffect(() => {
    localStorage.setItem("recipeme_shopping", JSON.stringify(shoppingList))
  }, [shoppingList])

  useEffect(() => {
    localStorage.setItem("recipeme_mealplans", JSON.stringify(mealPlans))
  }, [mealPlans])

  useEffect(() => {
    localStorage.setItem("recipeme_categories", JSON.stringify(userCategories))
  }, [userCategories])

  // Handle image upload and OCR
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result as string

        const response = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        })

        const data = await response.json()
        
        if (data.text) {
          const ingredientsArray = data.ingredients ? data.ingredients.split('\n').filter((i: string) => i.trim()) : []
          const nutrition = calculateNutrition(ingredientsArray)
          
          setNewRecipe({
            title: data.title || "Receita Importada",
            ingredients: data.ingredients || "",
            instructions: data.text,
            prepTime: data.prepTime || "30 min",
            servings: data.servings || "4 porções",
            category: data.category || "Diversos",
            imageUrl: "",
            source: "Imagem importada"
          })
          setShowImportDialog(false)
          setShowAddRecipe(true)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      alert('Erro ao processar a imagem. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Video = reader.result as string

        const response = await fetch('/api/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ video: base64Video }),
        })

        const data = await response.json()
        
        if (data.instructions) {
          const nutrition = calculateNutrition(data.ingredients || [])
          
          setNewRecipe({
            title: data.title || "Receita do Vídeo",
            ingredients: Array.isArray(data.ingredients) ? data.ingredients.join('\n') : "",
            instructions: data.instructions,
            prepTime: data.prepTime || "30 min",
            servings: data.servings || "4 porções",
            category: data.category || "Diversos",
            imageUrl: "",
            source: "Vídeo importado"
          })
          setShowImportDialog(false)
          setShowAddRecipe(true)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro ao processar vídeo:', error)
      alert('Erro ao processar o vídeo. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        await processAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordedChunks(chunks)
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error)
      alert('Erro ao acessar o microfone. Verifique as permissões.')
    }
  }

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  // Process audio
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Audio = reader.result as string

        const response = await fetch('/api/audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio }),
        })

        const data = await response.json()
        
        if (data.instructions) {
          const nutrition = calculateNutrition(data.ingredients || [])
          
          setNewRecipe({
            title: data.title || "Receita do Áudio",
            ingredients: Array.isArray(data.ingredients) ? data.ingredients.join('\n') : "",
            instructions: data.instructions,
            prepTime: data.prepTime || "30 min",
            servings: data.servings || "4 porções",
            category: data.category || "Diversos",
            imageUrl: "",
            source: "Áudio gravado"
          })
          setShowImportDialog(false)
          setShowAddRecipe(true)
        }
      }
      reader.readAsDataURL(audioBlob)
    } catch (error) {
      console.error('Erro ao processar áudio:', error)
      alert('Erro ao processar o áudio. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Add recipe
  const handleSaveRecipe = () => {
    if (!newRecipe.title || !newRecipe.ingredients || !newRecipe.instructions) {
      alert("Preencha pelo menos título, ingredientes e modo de preparo")
      return
    }

    const ingredientsArray = newRecipe.ingredients.split("\n").filter(i => i.trim())
    const nutrition = calculateNutrition(ingredientsArray)

    const recipe: Recipe = {
      id: Date.now().toString(),
      title: newRecipe.title,
      ingredients: ingredientsArray,
      instructions: newRecipe.instructions,
      prepTime: newRecipe.prepTime || "30 min",
      servings: newRecipe.servings || "4 porções",
      category: newRecipe.category || "Diversos",
      imageUrl: newRecipe.imageUrl,
      source: newRecipe.source || "Minha receita",
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isPublic: false,
      author: currentUser,
      likes: 0,
      comments: [],
      nutrition,
      userCategories: []
    }

    setRecipes([recipe, ...recipes])
    setNewRecipe({
      title: "",
      ingredients: "",
      instructions: "",
      prepTime: "",
      servings: "",
      category: "",
      imageUrl: "",
      source: ""
    })
    setShowAddRecipe(false)
  }

  // Import recipe from database
  const importRecipeFromDatabase = (dbRecipe: Recipe) => {
    const recipe: Recipe = {
      ...dbRecipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isPublic: false,
      author: currentUser,
      likes: 0,
      comments: [],
      userCategories: []
    }

    setRecipes([recipe, ...recipes])
    setSelectedRecipe(null)
    alert("Receita adicionada à sua coleção! 🎉")
  }

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setRecipes(recipes.map(r => 
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    ))
  }

  // Share to community
  const shareRecipe = (recipe: Recipe) => {
    const publicRecipe = { ...recipe, isPublic: true }
    setCommunityRecipes([publicRecipe, ...communityRecipes])
    alert("Receita compartilhada com a comunidade! 🎉")
  }

  // Like recipe
  const likeRecipe = (id: string) => {
    setCommunityRecipes(communityRecipes.map(r =>
      r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
    ))
  }

  // Add comment
  const addComment = (recipeId: string) => {
    if (!commentText.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      text: commentText,
      createdAt: new Date().toISOString()
    }

    setCommunityRecipes(communityRecipes.map(r =>
      r.id === recipeId 
        ? { ...r, comments: [...(r.comments || []), comment] }
        : r
    ))

    setCommentText("")
  }

  // Add to shopping list
  const addToShoppingList = (ingredients: string[]) => {
    const newItems = ingredients.map(ing => ({
      id: Date.now().toString() + Math.random(),
      name: ing,
      checked: false,
      category: "Ingredientes"
    }))
    setShoppingList([...shoppingList, ...newItems])
    alert("Ingredientes adicionados à lista de compras! 🛒")
  }

  // Toggle shopping item
  const toggleShoppingItem = (id: string) => {
    setShoppingList(shoppingList.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  // Delete shopping item
  const deleteShoppingItem = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id))
  }

  // Add to meal plan
  const addToMealPlan = (recipe: Recipe, date: string, meal: string) => {
    const mealPlan: MealPlan = {
      id: Date.now().toString(),
      date,
      meal,
      recipeId: recipe.id,
      recipeName: recipe.title
    }
    setMealPlans([...mealPlans, mealPlan])
    alert(`${recipe.title} adicionado ao plano de ${meal}! 📅`)
  }

  // Category management
  const addCategory = () => {
    if (!newCategoryName.trim()) return
    if (userCategories.includes(newCategoryName)) {
      alert("Esta categoria já existe!")
      return
    }
    setUserCategories([...userCategories, newCategoryName])
    setNewCategoryName("")
  }

  const toggleRecipeCategory = (recipeId: string, category: string) => {
    setRecipes(recipes.map(r => {
      if (r.id === recipeId) {
        const categories = r.userCategories || []
        const hasCategory = categories.includes(category)
        return {
          ...r,
          userCategories: hasCategory 
            ? categories.filter(c => c !== category)
            : [...categories, category]
        }
      }
      return r
    }))
  }

  // Get next 7 days
  const getNextDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dayNumber: date.getDate()
      })
    }
    return days
  }

  const nextDays = getNextDays()

  // Filter recipes - busca tanto nas receitas do usuário quanto no banco de dados
  const allRecipes = [...recipes, ...databaseRecipes]
  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.userCategories || []).some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const searchResults = searchTerm 
    ? databaseRecipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : []

  const favoriteRecipes = recipes.filter(r => r.isFavorite)
  const mostLikedCommunity = [...communityRecipes].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  // Group recipes by user categories
  const recipesByCategory = userCategories.reduce((acc, category) => {
    acc[category] = recipes.filter(r => r.userCategories?.includes(category))
    return acc
  }, {} as Record<string, Recipe[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-2 rounded-2xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  RecipeBR
                </h1>
                <p className="text-xs text-gray-500">Suas receitas favoritas</p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowImportDialog(true)}
              className="gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Importar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar receitas brasileiras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Search Results from Database */}
            {searchTerm && searchResults.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Receitas Encontradas ({searchResults.length})</h2>
                  <Badge className="bg-green-500">Banco de Receitas</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {searchResults.map((recipe) => (
                    <Card 
                      key={recipe.id}
                      className="cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="h-32 bg-gradient-to-br from-green-200 to-emerald-200 relative">
                        <div className="flex items-center justify-center h-full">
                          <ChefHat className="w-12 h-12 text-white opacity-50" />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">{recipe.title}</h3>
                        <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-700">
                          {recipe.category}
                        </Badge>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{recipe.prepTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* User Categories */}
            {userCategories.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Minhas Categorias</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCategoryDialog(true)}
                    className="gap-2"
                  >
                    <Tag className="w-4 h-4" />
                    Gerenciar
                  </Button>
                </div>
                <div className="space-y-4">
                  {userCategories.map(category => {
                    const categoryRecipes = recipesByCategory[category] || []
                    if (categoryRecipes.length === 0) return null
                    
                    return (
                      <div key={category}>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-orange-500" />
                          {category} ({categoryRecipes.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {categoryRecipes.slice(0, 4).map((recipe) => (
                            <Card 
                              key={recipe.id}
                              className="cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                              onClick={() => setSelectedRecipe(recipe)}
                            >
                              <div className="h-32 bg-gradient-to-br from-purple-200 to-pink-200 relative">
                                {recipe.imageUrl ? (
                                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <ChefHat className="w-12 h-12 text-white opacity-50" />
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-3">
                                <h3 className="font-semibold text-sm line-clamp-2">{recipe.title}</h3>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{recipe.prepTime}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Favorites Section */}
            {favoriteRecipes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <h2 className="text-lg font-bold">Favoritas</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {favoriteRecipes.slice(0, 4).map((recipe) => (
                    <Card 
                      key={recipe.id}
                      className="cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="h-32 bg-gradient-to-br from-orange-200 to-pink-200 relative">
                        {recipe.imageUrl ? (
                          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ChefHat className="w-12 h-12 text-white opacity-50" />
                          </div>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(recipe.id)
                          }}
                        >
                          <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">{recipe.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{recipe.prepTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Recipes */}
            <div>
              <h2 className="text-lg font-bold mb-4">Minhas Receitas ({filteredRecipes.length})</h2>
              {filteredRecipes.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center mb-4">
                      Nenhuma receita ainda.<br />Comece importando uma foto, vídeo ou áudio!
                    </p>
                    <Button
                      onClick={() => setShowImportDialog(true)}
                      className="gap-2 bg-gradient-to-r from-orange-500 to-pink-500"
                    >
                      <Plus className="w-4 h-4" />
                      Importar Primeira Receita
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredRecipes.map((recipe) => (
                    <Card 
                      key={recipe.id}
                      className="cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="h-32 bg-gradient-to-br from-orange-200 to-pink-200 relative">
                        {recipe.imageUrl ? (
                          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ChefHat className="w-12 h-12 text-white opacity-50" />
                          </div>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(recipe.id)
                          }}
                        >
                          <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">{recipe.title}</h3>
                        <Badge variant="secondary" className="mt-2 text-xs bg-orange-100 text-orange-700">
                          {recipe.category}
                        </Badge>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{recipe.prepTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === "community" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold">Comunidade</h2>
              </div>
              <p className="text-sm text-gray-600">Descubra e compartilhe receitas incríveis</p>
            </div>

            {mostLikedCommunity.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">
                    Nenhuma receita compartilhada ainda.<br />Seja o primeiro!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mostLikedCommunity.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white">
                            {recipe.author?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{recipe.author}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(recipe.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      {recipe.imageUrl && (
                        <div className="h-48 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-orange-200 to-pink-200">
                          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                      <Badge variant="secondary" className="mb-3 bg-orange-100 text-orange-700">
                        {recipe.category}
                      </Badge>

                      <div className="flex items-center gap-4 pt-3 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likeRecipe(recipe.id)}
                          className="gap-2"
                        >
                          <Heart className="w-4 h-4" />
                          {recipe.likes || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {recipe.comments?.length || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToShoppingList(recipe.ingredients)}
                          className="gap-2 ml-auto"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>

                      {recipe.comments && recipe.comments.length > 0 && (
                        <div className="mt-4 space-y-2 pt-4 border-t">
                          {recipe.comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                              <p className="font-semibold text-sm">{comment.author}</p>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="Adicionar comentário..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addComment(recipe.id)}
                        />
                        <Button
                          size="icon"
                          onClick={() => addComment(recipe.id)}
                          className="bg-gradient-to-r from-orange-500 to-pink-500"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shopping List Tab */}
        {activeTab === "shopping" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold">Lista de Compras</h2>
              </div>
              <p className="text-sm text-gray-600">
                {shoppingList.filter(i => !i.checked).length} itens pendentes
              </p>
            </div>

            {shoppingList.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">
                    Sua lista está vazia.<br />Adicione ingredientes de uma receita!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {shoppingList.map((item) => (
                  <Card key={item.id} className={item.checked ? "bg-gray-50" : ""}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleShoppingItem(item.id)}
                      />
                      <span className={`flex-1 ${item.checked ? 'line-through text-gray-400' : ''}`}>
                        {item.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteShoppingItem(item.id)}
                        className="h-8 w-8 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Meal Plan Tab */}
        {activeTab === "plan" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold">Plano de Refeições</h2>
              </div>
              <p className="text-sm text-gray-600">Organize suas refeições da semana</p>
            </div>

            <div className="space-y-4">
              {nextDays.map((day) => {
                const mealsForDay = mealPlans.filter(mp => mp.date === day.date)
                const isToday = day.date === new Date().toISOString().split('T')[0]

                return (
                  <Card key={day.date} className={isToday ? "border-orange-300 bg-orange-50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold capitalize">{day.dayName}</p>
                          <p className="text-sm text-gray-500">{day.dayNumber}</p>
                        </div>
                        {isToday && (
                          <Badge className="bg-orange-500">Hoje</Badge>
                        )}
                      </div>

                      {mealsForDay.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Nenhuma refeição planejada</p>
                      ) : (
                        <div className="space-y-2">
                          {mealsForDay.map((meal) => (
                            <div key={meal.id} className="bg-white rounded-lg p-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">{meal.meal}</p>
                                <p className="font-semibold text-sm">{meal.recipeName}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-orange-500" : "text-gray-400"}`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex flex-col items-center gap-1 ${activeTab === "community" ? "text-orange-500" : "text-gray-400"}`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Comunidade</span>
            </button>
            <button
              onClick={() => setActiveTab("shopping")}
              className={`flex flex-col items-center gap-1 ${activeTab === "shopping" ? "text-orange-500" : "text-gray-400"}`}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs font-medium">Compras</span>
            </button>
            <button
              onClick={() => setActiveTab("plan")}
              className={`flex flex-col items-center gap-1 ${activeTab === "plan" ? "text-orange-500" : "text-gray-400"}`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-medium">Plano</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Receita</DialogTitle>
            <DialogDescription>
              Escolha como deseja importar sua receita
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleVideoUpload}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-16"
            >
              <Camera className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Foto</div>
                <div className="text-xs opacity-90">Tire uma foto da receita</div>
              </div>
            </Button>

            <Button
              onClick={() => videoInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-16"
            >
              <Video className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Vídeo</div>
                <div className="text-xs opacity-90">Grave um vídeo explicando a receita</div>
              </div>
            </Button>

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-full gap-2 h-16 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'}`}
            >
              <Mic className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">{isRecording ? 'Parar Gravação' : 'Áudio'}</div>
                <div className="text-xs opacity-90">{isRecording ? 'Clique para parar' : 'Grave a receita por voz'}</div>
              </div>
            </Button>

            <Button
              onClick={() => {
                setShowImportDialog(false)
                setShowAddRecipe(true)
              }}
              variant="outline"
              className="w-full gap-2 h-16"
            >
              <Edit2 className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Manual</div>
                <div className="text-xs">Digite a receita manualmente</div>
              </div>
            </Button>

            {isProcessing && (
              <div className="text-center text-sm text-gray-500 py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                Processando com IA...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Recipe Dialog */}
      <Dialog open={showAddRecipe} onOpenChange={setShowAddRecipe}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Receita</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da sua receita
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Título *</label>
              <Input
                placeholder="Ex: Bolo de Chocolate"
                value={newRecipe.title}
                onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tempo de Preparo</label>
                <Input
                  placeholder="Ex: 30 min"
                  value={newRecipe.prepTime}
                  onChange={(e) => setNewRecipe({ ...newRecipe, prepTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Porções</label>
                <Input
                  placeholder="Ex: 4 porções"
                  value={newRecipe.servings}
                  onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <Input
                placeholder="Ex: Sobremesa, Almoço, Jantar"
                value={newRecipe.category}
                onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Fonte</label>
              <Input
                placeholder="Ex: Instagram @chef, Pinterest, Blog..."
                value={newRecipe.source}
                onChange={(e) => setNewRecipe({ ...newRecipe, source: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ingredientes * (um por linha)</label>
              <Textarea
                placeholder="2 xícaras de farinha&#10;3 ovos&#10;1 xícara de açúcar"
                value={newRecipe.ingredients}
                onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                rows={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Modo de Preparo *</label>
              <Textarea
                placeholder="Descreva o passo a passo..."
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                rows={8}
              />
            </div>
            <Button 
              onClick={handleSaveRecipe} 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              Salvar Receita
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>
              Crie categorias personalizadas para organizar suas receitas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nome da categoria (ex: Dieta, Bolos, Tortas)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              />
              <Button onClick={addCategory} className="bg-orange-500">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Categorias Criadas:</p>
              {userCategories.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nenhuma categoria criada ainda</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userCategories.map(category => (
                    <Badge key={category} variant="secondary" className="gap-2">
                      {category}
                      <button
                        onClick={() => setUserCategories(userCategories.filter(c => c !== category))}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {selectedRecipeForCategory && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Categorias de: {selectedRecipeForCategory.title}</p>
                <div className="space-y-2">
                  {userCategories.map(category => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedRecipeForCategory.userCategories?.includes(category)}
                        onCheckedChange={() => toggleRecipeCategory(selectedRecipeForCategory.id, category)}
                      />
                      <span className="text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedRecipe.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-orange-100 text-orange-700">{selectedRecipe.category}</Badge>
                  <span className="text-sm text-gray-500">• {selectedRecipe.source}</span>
                </div>
              </DialogHeader>

              {selectedRecipe.imageUrl && (
                <div className="h-64 rounded-xl overflow-hidden bg-gradient-to-br from-orange-200 to-pink-200">
                  <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedRecipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{selectedRecipe.servings}</span>
                </div>
              </div>

              {/* Nutrition Info */}
              {selectedRecipe.nutrition && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-lg">Informações Nutricionais</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span><strong>{selectedRecipe.nutrition.calories}</strong> kcal</span>
                    </div>
                    <div>
                      <strong>Proteínas:</strong> {selectedRecipe.nutrition.protein}g
                    </div>
                    <div>
                      <strong>Carboidratos:</strong> {selectedRecipe.nutrition.carbs}g
                    </div>
                    <div>
                      <strong>Gorduras:</strong> {selectedRecipe.nutrition.fat}g
                    </div>
                    <div>
                      <strong>Fibras:</strong> {selectedRecipe.nutrition.fiber}g
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-lg mb-3">Ingredientes</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Modo de Preparo</h3>
                <p className="whitespace-pre-line text-gray-700">{selectedRecipe.instructions}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => addToShoppingList(selectedRecipe.ingredients)}
                  className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Adicionar à Lista
                </Button>
                
                {selectedRecipe.author === "RecipeBR" ? (
                  <Button
                    onClick={() => importRecipeFromDatabase(selectedRecipe)}
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar à Coleção
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => shareRecipe(selectedRecipe)}
                      className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-blue-500"
                    >
                      <Share2 className="w-4 h-4" />
                      Compartilhar
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRecipeForCategory(selectedRecipe)
                        setShowCategoryDialog(true)
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Categorias
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
