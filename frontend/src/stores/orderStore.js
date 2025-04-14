
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  async function fetchOrders(userId) {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700))
      
      orders.value = generateMockOrders(userId)
    } catch (err) {
      error.value = 'Failed to fetch orders'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  async function createOrder(gameId, userId, paymentMethod) {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const order = {
        id: generateOrderId(),
        gameId,
        userId,
        status: 'pending',
        price: gameId.price,
        paymentMethod,
        createdAt: new Date().toISOString()
      }
      
      currentOrder.value = order
      orders.value = [order, ...orders.value]
      
      return order
    } catch (err) {
      error.value = 'Failed to create order'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  async function getOrderById(orderId) {
    // First check if we have it in our current state
    const order = orders.value.find(o => o.id === orderId)
    
    if (order) return order
    
    // In a real app, this would fetch the order from the API
    isLoading.value = true
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      isLoading.value = false
      return null // In a mock app, we don't have this order if it's not in state
    } catch (err) {
      error.value = 'Failed to fetch order'
      isLoading.value = false
      console.error(err)
      return null
    }
  }
  
  async function cancelOrder(orderId) {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Update the order in our state
      const orderIndex = orders.value.findIndex(o => o.id === orderId)
      
      if (orderIndex !== -1) {
        const updatedOrder = { ...orders.value[orderIndex], status: 'cancelled' }
        orders.value[orderIndex] = updatedOrder
        
        if (currentOrder.value?.id === orderId) {
          currentOrder.value = updatedOrder
        }
        
        return true
      }
      
      return false
    } catch (err) {
      error.value = 'Failed to cancel order'
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    getOrderById,
    cancelOrder
  }
})

// Helper function to generate mock orders
function generateMockOrders(userId) {
  const statuses = [
    'pending', 'processing', 'completed', 'cancelled'
  ]
  
  const games = [
    'League of Legends',
    'World of Warcraft',
    'Genshin Impact',
    'Valorant',
    'Fortnite'
  ]
  
  return Array.from({ length: 5 }, (_, i) => {
    const id = generateOrderId()
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const game = games[Math.floor(Math.random() * games.length)]
    const price = Math.floor(Math.random() * 900) + 100
    
    const gameId = {
      id: `game-${i + 1}`,
      title: `${game} Premium Account`,
      game,
      description: 'High-level account with rare items.',
      price,
      level: Math.floor(Math.random() * 100) + 1,
      imageUrl: `/placeholder.svg`,
      seller: {
        id: '2',
        username: 'proGamer',
        rating: 4.8
      },
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }
    
    return {
      id,
      gameId,
      userId,
      status,
      price,
      paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }
  })
}

function generateOrderId() {
  return `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}
