
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  
  const isAuthenticated = computed(() => !!user.value)
  
  function setUser(newUser) {
    user.value = newUser
  }
  
  function setToken(newToken) {
    localStorage.setItem('token', newToken)
    token.value = newToken
  }
  
  function logout() {
    localStorage.removeItem('token')
    user.value = null
    token.value = null
  }
  
  async function login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (email === 'demo@example.com' && password === 'password') {
      const newUser = {
        id: '1',
        username: 'gamer123',
        email: 'demo@example.com',
        avatarUrl: '/placeholder.svg'
      }
      
      setUser(newUser)
      setToken('mock-jwt-token')
      return true
    }
    
    return false
  }
  
  async function register(username, email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newUser = {
      id: '1',
      username,
      email,
      avatarUrl: '/placeholder.svg'
    }
    
    setUser(newUser)
    setToken('mock-jwt-token')
    return true
  }
  
  async function checkAuth() {
    const savedToken = localStorage.getItem('token')
    
    if (savedToken) {
      const newUser = {
        id: '1',
        username: 'gamer123',
        email: 'demo@example.com',
        avatarUrl: '/placeholder.svg'
      }
      
      user.value = newUser
      token.value = savedToken
      return true
    }
    
    return false
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
    login,
    register,
    checkAuth
  }
})
