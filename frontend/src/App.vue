
<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <header class="border-b border-gray-800">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-2xl font-bold text-gaming-cyan">GameID Emporium</router-link>
        </div>
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="hover:text-gaming-cyan transition-colors">Home</router-link>
          <router-link to="/marketplace" class="hover:text-gaming-cyan transition-colors">Marketplace</router-link>
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="hover:text-gaming-cyan transition-colors">Profile</router-link>
            <router-link to="/orders" class="hover:text-gaming-cyan transition-colors">My Orders</router-link>
            <cart-dropdown />
            <button @click="logout" class="hover:text-gaming-cyan transition-colors">Logout</button>
          </template>
          <template v-else>
            <cart-dropdown />
            <router-link to="/login" class="hover:text-gaming-cyan transition-colors">Login</router-link>
            <router-link to="/register" class="btn-accent">Sign Up</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <footer class="border-t border-gray-800 py-8">
      <div class="container mx-auto px-4">
        <div class="text-center text-gray-400 text-sm">
          &copy; {{ new Date().getFullYear() }} GameID Emporium. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';
import CartDropdown from './components/CartDropdown.vue';

const router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --gaming-cyan: #0ff;
  --gaming-blue: #0070f3;
  --gaming-purple: #9c27b0;
}

.btn-accent {
  @apply bg-gaming-cyan text-black px-4 py-2 rounded font-medium hover:bg-opacity-80 transition-colors;
}

.gaming-card {
  @apply bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg;
}

.text-gaming-cyan {
  color: var(--gaming-cyan);
}
</style>
