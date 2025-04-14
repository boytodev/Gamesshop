
<template>
  <div class="max-w-md mx-auto">
    <div class="gaming-card">
      <h1 class="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
      
      <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
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
          <div class="flex justify-between items-center mb-1">
            <label for="password" class="block text-sm font-medium">
              Password
            </label>
            <router-link to="#" class="text-xs text-gaming-cyan hover:underline">
              Forgot password?
            </router-link>
          </div>
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
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        <p>
          Don't have an account?
          <router-link to="/register" class="text-gaming-cyan hover:underline">
            Register
          </router-link>
        </p>
      </div>
      
      <div class="mt-6 text-center text-xs text-gray-500">
        <p>Demo credentials:</p>
        <p>Email: demo@example.com</p>
        <p>Password: password</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Get the page they were trying to access before being redirected to login
const from = route.query.redirect?.toString() || '/';

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;
  
  try {
    const success = await authStore.login(email.value, password.value);
    
    if (success) {
      // Navigate to the page they were trying to access, or home if they came directly to login
      router.replace(from);
    } else {
      error.value = "Invalid email or password. Try demo@example.com / password";
    }
  } catch (err) {
    error.value = "An error occurred during login. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
