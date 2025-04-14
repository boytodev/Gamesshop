
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">Game ID Marketplace</h1>
      <p class="text-gray-400">Browse premium gaming accounts from verified sellers</p>
    </div>
    
    <!-- Loading state -->
    <div v-if="gameStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="gaming-card animate-pulse">
        <div class="aspect-video bg-gaming-blue/20 rounded mb-4"></div>
        <div class="h-6 bg-gaming-blue/20 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gaming-blue/20 rounded w-1/2 mb-4"></div>
        <div class="h-6 bg-gaming-blue/20 rounded w-1/4"></div>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="gameStore.error" class="gaming-card text-center py-12">
      <p class="text-red-500 mb-4">{{ gameStore.error }}</p>
      <button @click="fetchGameIds" class="btn-accent">
        Try Again
      </button>
    </div>
    
    <!-- Game list -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link 
          v-for="game in gameStore.gameIds" 
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
      
      <!-- Pagination -->
      <div class="mt-12 flex justify-center">
        <div class="flex space-x-2">
          <button 
            @click="previousPage" 
            :disabled="gameStore.currentPage === 1"
            class="px-3 py-1 border border-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span 
            v-for="page in gameStore.totalPages" 
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 border border-gray-700 rounded-md cursor-pointer"
            :class="{ 'bg-gaming-cyan text-black': gameStore.currentPage === page }"
          >
            {{ page }}
          </span>
          
          <button 
            @click="nextPage" 
            :disabled="gameStore.currentPage === gameStore.totalPages"
            class="px-3 py-1 border border-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

onMounted(() => {
  fetchGameIds();
});

const fetchGameIds = () => {
  gameStore.fetchGameIds(gameStore.currentPage);
};

const changePage = (page) => {
  gameStore.fetchGameIds(page);
};

const previousPage = () => {
  if (gameStore.currentPage > 1) {
    changePage(gameStore.currentPage - 1);
  }
};

const nextPage = () => {
  if (gameStore.currentPage < gameStore.totalPages) {
    changePage(gameStore.currentPage + 1);
  }
};
</script>
