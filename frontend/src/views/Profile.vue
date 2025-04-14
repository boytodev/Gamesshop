
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">Your Profile</h1>
    </div>
    
    <div class="gaming-card">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div class="w-24 h-24 bg-gaming-blue/20 rounded-full flex items-center justify-center overflow-hidden">
          <img v-if="user?.avatarUrl" :src="user.avatarUrl" :alt="user?.username" class="w-full h-full object-cover" />
          <span v-else class="text-4xl">{{ getUserInitials() }}</span>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold">{{ user?.username }}</h2>
          <p class="text-gray-400">{{ user?.email }}</p>
          <p class="text-gray-400 text-sm mt-1">Account created on {{ formatDate(new Date()) }}</p>
        </div>
      </div>
      
      <div class="border-t border-gray-700 pt-6">
        <h3 class="text-xl font-bold mb-4">Account Settings</h3>
        
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              v-model="formUsername"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              v-model="formEmail"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
            />
          </div>
          
          <div class="pt-2">
            <button type="submit" class="btn-accent" :disabled="isLoading">
              {{ isLoading ? "Saving..." : "Update Profile" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const formUsername = ref('');
const formEmail = ref('');
const isLoading = ref(false);

onMounted(() => {
  if (user.value) {
    formUsername.value = user.value.username || '';
    formEmail.value = user.value.email || '';
  }
});

const getUserInitials = () => {
  if (!user.value?.username) return '?';
  return user.value.username.charAt(0).toUpperCase();
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const updateProfile = async () => {
  isLoading.value = true;
  
  try {
    // In a real app, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update local user
    authStore.setUser({
      ...user.value,
      username: formUsername.value,
      email: formEmail.value
    });
    
    alert('Profile updated successfully!');
  } catch (err) {
    console.error(err);
    alert('Failed to update profile.');
  } finally {
    isLoading.value = false;
  }
};
</script>
