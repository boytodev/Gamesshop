
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isCartOpen = ref(false)
  const authStore = useAuthStore()
  
  const totalItems = computed(() => items.value.length)
  
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price, 0)
  })
  
  // Check if a game is already in the cart
  const isInCart = (gameId) => {
    return items.value.some(item => item.id === gameId)
  }
  
  // Add a game to the cart
  function addItem(game) {
    if (!isInCart(game.id)) {
      items.value.push(game)
    }
  }
  
  // Remove a game from the cart
  function removeItem(gameId) {
    const index = items.value.findIndex(item => item.id === gameId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }
  
  // Clear all items from the cart
  function clearCart() {
    items.value = []
  }
  
  // Toggle cart visibility
  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }
  
  // Close cart
  function closeCart() {
    isCartOpen.value = false
  }
  
  // Open cart
  function openCart() {
    isCartOpen.value = true
  }
  
  // Proceed to checkout
  function proceedToCheckout() {
    // If only one item, go directly to that item's checkout
    if (items.value.length === 1) {
      const gameId = items.value[0].id
      clearCart()
      closeCart()
      return { redirect: `/checkout/${gameId}` }
    }
    
    // For multiple items, we'll implement a cart checkout page later
    return { redirect: '/checkout' }
  }
  
  return {
    items,
    isCartOpen,
    totalItems,
    totalPrice,
    isInCart,
    addItem,
    removeItem,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    proceedToCheckout
  }
})
