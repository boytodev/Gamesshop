
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4">Your Orders</h1>
    </div>
    
    <div v-if="orderStore.isLoading" class="gaming-card animate-pulse">
      <div v-for="i in 3" :key="i" class="border-b border-gray-700 py-4 last:border-b-0 last:pb-0">
        <div class="h-6 bg-gaming-blue/20 rounded w-1/4 mb-3"></div>
        <div class="h-4 bg-gaming-blue/20 rounded w-3/4 mb-3"></div>
        <div class="h-4 bg-gaming-blue/20 rounded w-1/2"></div>
      </div>
    </div>
    
    <div v-else-if="orderStore.error" class="gaming-card">
      <p class="text-red-500 mb-4">{{ orderStore.error }}</p>
      <button @click="fetchOrders" class="btn-accent">
        Try Again
      </button>
    </div>
    
    <div v-else-if="orderStore.orders.length === 0" class="gaming-card">
      <p class="text-gray-400 mb-4">You haven't made any orders yet.</p>
      <router-link to="/marketplace" class="btn-accent inline-block">
        Browse Marketplace
      </router-link>
    </div>
    
    <div v-else class="gaming-card">
      <div v-for="order in orderStore.orders" :key="order.id" 
           class="border-b border-gray-700 py-4 last:border-b-0 last:pb-0">
        <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <router-link :to="`/order/${order.id}`" class="text-xl font-bold text-gaming-cyan hover:underline">
              Order #{{ order.id }}
            </router-link>
            <p class="text-gray-400">{{ formatDate(order.createdAt) }}</p>
            <p class="text-gray-400">{{ order.gameId.title }}</p>
          </div>
          
          <div class="flex flex-col items-start md:items-end">
            <p class="text-xl font-bold">${{ order.price }}</p>
            <p class="text-sm text-gray-400">{{ order.paymentMethod }}</p>
            <span class="mt-1 px-2 py-0.5 rounded-full text-xs"
                 :class="{
                   'bg-yellow-500/20 text-yellow-500': order.status === 'pending',
                   'bg-blue-500/20 text-blue-500': order.status === 'processing',
                   'bg-green-500/20 text-green-500': order.status === 'completed',
                   'bg-red-500/20 text-red-500': order.status === 'cancelled'
                 }"
            >
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';

const orderStore = useOrderStore();
const authStore = useAuthStore();

onMounted(() => {
  fetchOrders();
});

const fetchOrders = () => {
  if (authStore.user) {
    orderStore.fetchOrders(authStore.user.id);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
