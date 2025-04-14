
<template>
  <div class="max-w-md mx-auto">
    <div class="gaming-card">
      <h1 class="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      
      <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            v-model="username"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
            placeholder="gamertag123"
            required
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button
          type="submit"
          class="w-full btn-accent"
          :disabled="isLoading"
        >
          {{ isLoading ? "Creating Account..." : "Create Account" }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        <p>
          Already have an account?
          <router-link to="/login" class="text-gaming-cyan hover:underline">
            Login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const username = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;
  
  try {
    const success = await authStore.register(username.value, email.value, password.value);
    
    if (success) {
      router.push('/');
    } else {
      error.value = "An error occurred during registration. Please try again.";
    }
  } catch (err) {
    error.value = "An error occurred during registration. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
