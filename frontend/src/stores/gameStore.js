import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  const gameIds = ref([])
  const featuredGameIds = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const totalPages = ref(1)
  const currentPage = ref(1)
  
  async function fetchGameIds(page = 1, limit = 8) {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      gameIds.value = generateMockGameIds(limit, page)
      currentPage.value = page
      totalPages.value = 5 // Simulate 5 pages of results
    } catch (err) {
      error.value = 'Failed to fetch game IDs'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  async function fetchFeaturedGameIds() {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600))
      
      featuredGameIds.value = generateMockGameIds(4, 1)
    } catch (err) {
      error.value = 'Failed to fetch featured game IDs'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  async function getGameIdById(id) {
    // First check if we have it in our current state
    const foundGame = gameIds.value.find(g => g.id === id) || 
                      featuredGameIds.value.find(g => g.id === id)
    
    if (foundGame) return foundGame
    
    // Otherwise, fetch it (in a real app)
    // For now, just generate a mock game ID
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      id,
      title: `Game Account #${id}`,
      game: getRandomGame(),
      description: 'High-level account with rare items and characters. Perfect for serious players.',
      price: Math.floor(Math.random() * 900) + 100,
      level: Math.floor(Math.random() * 100) + 1,
      characters: ['Rare Character 1', 'Rare Character 2'],
      items: ['Legendary Weapon', 'Rare Armor Set', 'Limited Edition Pet'],
      imageUrl: `/placeholder.svg`,
      seller: {
        id: '2',
        username: 'proGamer',
        rating: 4.8
      },
      createdAt: new Date().toISOString()
    }
  }

  return {
    gameIds,
    featuredGameIds,
    isLoading,
    error,
    totalPages,
    currentPage,
    fetchGameIds,
    fetchFeaturedGameIds,
    getGameIdById
  }
})

// Helper function to generate mock data
function generateMockGameIds(count, page) {
  const startIndex = (page - 1) * count
  
  return Array.from({ length: count }, (_, i) => {
    const id = `${startIndex + i + 1}`
    const game = getRandomGame()
    
    return {
      id,
      title: `${game} Premium Account`,
      game,
      description: 'High-level account with rare items and characters. Perfect for serious players.',
      price: Math.floor(Math.random() * 900) + 100,
      level: Math.floor(Math.random() * 100) + 1,
      imageUrl: `/placeholder.svg`,
      seller: {
        id: '2',
        username: 'proGamer',
        rating: 4.8
      },
      createdAt: new Date().toISOString()
    }
  })
}

function getRandomGame() {
  const games = [
    'League of Legends',
    'World of Warcraft',
    'Genshin Impact',
    'Valorant',
    'Fortnite',
    'PUBG',
    'Minecraft',
    'Overwatch'
  ]
  
  return games[Math.floor(Math.random() * games.length)]
}
