
<template>
  <div v-if="isLoading" class="gaming-card animate-pulse">
    <div class="h-10 bg-gaming-blue/20 rounded w-3/4 mb-6"></div>
    <div class="h-60 bg-gaming-blue/20 rounded mb-6"></div>
    <div class="h-4 bg-gaming-blue/20 rounded w-1/2 mb-4"></div>
    <div class="h-4 bg-gaming-blue/20 rounded w-full mb-4"></div>
    <div class="h-8 bg-gaming-blue/20 rounded w-1/4 mb-6"></div>
    <div class="h-12 bg-gaming-blue/20 rounded w-full"></div>
  </div>
  
  <div v-else-if="error" class="gaming-card">
    <p class="text-red-500 mb-4">{{ error }}</p>
    <router-link to="/marketplace" class="text-gaming-cyan hover:underline">
      Back to Marketplace
    </router-link>
  </div>
  
  <div v-else-if="game" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
      <div class="gaming-card">
        <h1 class="text-2xl font-bold mb-4">{{ game.title }}</h1>
        
        <div class="aspect-video bg-gaming-blue/20 rounded mb-6 overflow-hidden">
          <img :src="game.imageUrl" :alt="game.title" class="w-full h-full object-cover" />
        </div>
        
        <div class="mb-6">
          <h2 class="text-xl font-bold mb-2">Description</h2>
          <p class="text-gray-300">{{ game.description }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 class="text-xl font-bold mb-2">Details</h2>
            <ul class="space-y-2 text-gray-300">
              <li><span class="text-gray-500">Game:</span> {{ game.game }}</li>
              <li><span class="text-gray-500">Level:</span> {{ game.level }}</li>
              <li><span class="text-gray-500">Listed on:</span> {{ formatDate(game.createdAt) }}</li>
            </ul>
          </div>
          
          <div v-if="game.characters || game.items">
            <h2 class="text-xl font-bold mb-2">Includes</h2>
            <div v-if="game.characters?.length" class="mb-3">
              <h3 class="text-sm text-gray-500 mb-1">Characters:</h3>
              <ul class="list-disc list-inside text-gray-300">
                <li v-for="character in game.characters" :key="character">{{ character }}</li>
              </ul>
            </div>
            <div v-if="game.items?.length">
              <h3 class="text-sm text-gray-500 mb-1">Items:</h3>
              <ul class="list-disc list-inside text-gray-300">
                <li v-for="item in game.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="lg:col-span-1">
      <div class="gaming-card sticky top-4">
        <div class="mb-6">
          <p class="text-3xl font-bold text-gaming-cyan">${{ game.price }}</p>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-bold mb-2">Seller Information</h3>
          <div class="flex items-center mb-2">
            <div class="w-10 h-10 bg-gaming-blue/20 rounded-full mr-3"></div>
            <div>
              <p class="font-medium">{{ game.seller.username }}</p>
              <div class="flex items-center">
                <span class="text-yellow-500 mr-1">★</span>
                <span class="text-sm">{{ game.seller.rating }} / 5</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-3">
          <button 
            v-if="!cartStore.isInCart(game.id)" 
            @click="addToCart" 
            class="btn-outline border-gaming-cyan/50 text-gaming-cyan hover:bg-gaming-cyan/20 block text-center w-full"
          >
            Add to Cart
          </button>
          
          <button 
            v-else 
            @click="viewCart" 
            class="border border-gaming-cyan/50 bg-gaming-cyan/20 text-gaming-cyan px-4 py-2 rounded w-full flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            In Cart - View Cart
          </button>
          
          <div v-if="isAuthenticated">
            <router-link :to="`/checkout/${game.id}`" class="btn-accent block text-center w-full">
              Buy Now
            </router-link>
          </div>
          <div v-else>
            <router-link to="/login" class="btn-accent block text-center w-full">
              Login to Purchase
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

const route = useRoute();
const gameStore = useGameStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const game = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  const gameId = route.params.id;
  
  try {
    const gameData = await gameStore.getGameIdById(gameId);
    
    if (gameData) {
      game.value = gameData;
    } else {
      error.value = "Game ID not found";
    }
  } catch (err) {
    error.value = "Failed to load game details";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const addToCart = () => {
  cartStore.addItem(game.value);
  cartStore.openCart();
};

const viewCart = () => {
  cartStore.openCart();
};
</script>
