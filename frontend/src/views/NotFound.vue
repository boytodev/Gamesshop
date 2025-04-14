
<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p class="text-xl text-gray-400 mb-4">Oops! Page not found</p>
      <router-link to="/" class="text-gaming-cyan hover:underline">
        Return to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  console.error("404 Error: User attempted to access non-existent route:", route.path);
});
</script>
