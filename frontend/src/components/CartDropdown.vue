
<template>
  <div class="relative">
    <!-- Cart Toggle Button -->
    <button 
      @click="cartStore.toggleCart" 
      class="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
    >
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span 
          v-if="cartStore.totalItems > 0" 
          class="absolute -top-2 -right-2 bg-gaming-cyan text-xs text-black font-bold rounded-full h-5 w-5 flex items-center justify-center"
        >
          {{ cartStore.totalItems }}
        </span>
      </div>
      <span class="hidden sm:inline">Cart</span>
    </button>
    
    <!-- Cart Dropdown -->
    <div 
      v-if="cartStore.isCartOpen" 
      class="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
    >
      <div class="p-4 border-b border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="font-bold">Shopping Cart ({{ cartStore.totalItems }})</h3>
          <button @click="cartStore.closeCart" class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div v-if="cartStore.totalItems === 0" class="p-6 text-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p>Your cart is empty</p>
        <router-link to="/marketplace" @click="cartStore.closeCart" class="text-gaming-cyan mt-2 inline-block hover:underline">
          Browse Marketplace
        </router-link>
      </div>
      
      <div v-else class="max-h-80 overflow-y-auto">
        <div v-for="item in cartStore.items" :key="item.id" class="p-4 border-b border-gray-700 flex gap-3">
          <div class="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
            <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover">
          </div>
          <div class="flex-grow">
            <h4 class="font-medium text-sm">{{ item.title }}</h4>
            <p class="text-sm text-gray-400">{{ item.game }}</p>
            <div class="flex justify-between items-center mt-1">
              <p class="font-bold text-gaming-cyan">${{ item.price }}</p>
              <button @click="cartStore.removeItem(item.id)" class="text-red-400 hover:text-red-300 text-sm">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="cartStore.totalItems > 0" class="p-4">
        <div class="flex justify-between font-bold mb-4">
          <span>Total:</span>
          <span class="text-gaming-cyan">${{ cartStore.totalPrice }}</span>
        </div>
        <button 
          @click="checkout" 
          class="btn-accent w-full"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const checkout = () => {
  const result = cartStore.proceedToCheckout();
  
  if (result.redirect) {
    if (authStore.isAuthenticated) {
      router.push(result.redirect);
    } else {
      router.push('/login?redirect=' + encodeURIComponent(result.redirect));
    }
  }
};
</script>
