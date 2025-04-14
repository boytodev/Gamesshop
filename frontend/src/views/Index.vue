
<template>
  <div>
    <section class="hero py-12 md:py-20">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          GameID <span class="text-gaming-cyan">Emporium</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Buy and sell premium gaming accounts with rare items, characters, and high rankings.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/marketplace" class="btn-accent text-center">
            Browse Marketplace
          </router-link>
          <router-link to="/register" class="border border-gaming-cyan text-gaming-cyan px-4 py-2 rounded font-medium hover:bg-gaming-cyan/10 transition-colors text-center">
            Create Account
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-12">
      <h2 class="text-3xl font-bold mb-8 text-center">Featured Accounts</h2>
      
      <div v-if="gameStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="gaming-card animate-pulse">
          <div class="aspect-video bg-gaming-blue/20 rounded mb-4"></div>
          <div class="h-6 bg-gaming-blue/20 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gaming-blue/20 rounded w-1/2 mb-4"></div>
          <div class="h-6 bg-gaming-blue/20 rounded w-1/4"></div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link 
          v-for="game in gameStore.featuredGameIds" 
          :key="game.id" 
          :to="`/game/${game.id}`"
          class="gaming-card block hover:border-gaming-cyan/50 transition-colors"
        >
          <div class="aspect-video bg-gaming-blue/20 rounded mb-4 overflow-hidden">
            <img :src="game.imageUrl" :alt="game.title" class="w-full h-full object-cover" />
          </div>
          <h3 class="font-bold mb-2">{{ game.title }}</h3>
          <p class="text-gray-400 text-sm mb-4">Level {{ game.level }} · {{ game.game }}</p>
          <p class="text-xl font-bold text-gaming-cyan">${{ game.price }}</p>
        </router-link>
      </div>
      
      <div class="text-center mt-10">
        <router-link to="/marketplace" class="text-gaming-cyan hover:underline inline-flex items-center">
          View All Accounts
          <span class="ml-1">→</span>
        </router-link>
      </div>
    </section>
    
    <section class="py-12 bg-gray-800/50 rounded-lg my-12">
      <div class="text-center max-w-3xl mx-auto px-4">
        <h2 class="text-3xl font-bold mb-6">Why Choose GameID Emporium?</h2>
        <div class="grid md:grid-cols-3 gap-8 mt-10">
          <div>
            <div class="bg-gaming-cyan/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <div class="text-gaming-cyan text-2xl">✓</div>
            </div>
            <h3 class="text-xl font-bold mb-2">Verified Sellers</h3>
            <p class="text-gray-400">All our sellers go through a verification process to ensure legitimacy.</p>
          </div>
          <div>
            <div class="bg-gaming-cyan/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <div class="text-gaming-cyan text-2xl">🛡️</div>
            </div>
            <h3 class="text-xl font-bold mb-2">Secure Transfers</h3>
            <p class="text-gray-400">Our escrow system protects both buyers and sellers during transactions.</p>
          </div>
          <div>
            <div class="bg-gaming-cyan/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <div class="text-gaming-cyan text-2xl">💬</div>
            </div>
            <h3 class="text-xl font-bold mb-2">24/7 Support</h3>
            <p class="text-gray-400">Our team is always available to help with any issues or questions.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

onMounted(() => {
  gameStore.fetchFeaturedGameIds();
});
</script>
