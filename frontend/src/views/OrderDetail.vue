
<template>
  <div v-if="isLoading" class="gaming-card animate-pulse">
    <div class="h-10 bg-gaming-blue/20 rounded w-1/2 mb-6"></div>
    <div class="h-4 bg-gaming-blue/20 rounded w-full mb-4"></div>
    <div class="h-4 bg-gaming-blue/20 rounded w-3/4 mb-6"></div>
    <div class="h-40 bg-gaming-blue/20 rounded mb-6"></div>
    <div class="h-10 bg-gaming-blue/20 rounded w-1/3"></div>
  </div>
  
  <div v-else-if="error" class="gaming-card">
    <p class="text-red-500 mb-4">{{ error }}</p>
    <router-link to="/orders" class="text-gaming-cyan hover:underline">
      Back to Orders
    </router-link>
  </div>
  
  <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
      <div class="gaming-card">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-2xl font-bold mb-1">Order #{{ order.id }}</h1>
            <p class="text-gray-400">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-sm"
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
        
        <div class="border-t border-gray-700 py-6">
          <h2 class="text-xl font-bold mb-4">Order Details</h2>
          
          <div class="flex flex-col md:flex-row items-start gap-6 mb-6">
            <div class="w-full md:w-1/3 aspect-video bg-gaming-blue/20 rounded overflow-hidden">
              <img :src="order.gameId.imageUrl" :alt="order.gameId.title" class="w-full h-full object-cover" />
            </div>
            
            <div class="flex-1">
              <h3 class="text-lg font-bold mb-2">{{ order.gameId.title }}</h3>
              <p class="text-gray-400 mb-3">{{ order.gameId.description }}</p>
              <div class="text-sm text-gray-400">
                <p>Level: {{ order.gameId.level }}</p>
                <p>Game: {{ order.gameId.game }}</p>
              </div>
              <p class="text-xl font-bold text-gaming-cyan mt-3">${{ order.price }}</p>
            </div>
          </div>
          
          <div class="border-t border-gray-700 pt-6">
            <h3 class="text-lg font-bold mb-3">Payment Details</h3>
            <p><span class="text-gray-400">Payment Method:</span> {{ order.paymentMethod }}</p>
            <p><span class="text-gray-400">Order Total:</span> ${{ order.price }}</p>
          </div>
        </div>
        
        <div v-if="order.status === 'pending'" class="mt-6">
          <button @click="cancelOrder" class="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500/10 transition-colors">
            Cancel Order
          </button>
        </div>
      </div>
    </div>
    
    <div class="lg:col-span-1">
      <div class="gaming-card">
        <h2 class="text-xl font-bold mb-4">Order Status</h2>
        
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black shrink-0 mr-3">
              ✓
            </div>
            <div>
              <p class="font-medium">Order Placed</p>
              <p class="text-gray-400 text-sm">{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3"
                 :class="order.status !== 'pending' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-500'"
            >
              {{ order.status !== 'pending' ? '✓' : '2' }}
            </div>
            <div>
              <p class="font-medium" :class="order.status === 'pending' ? 'text-gray-500' : ''">
                Processing
              </p>
              <p class="text-gray-400 text-sm">{{ order.status !== 'pending' ? 'Your order is being processed' : 'Waiting for processing' }}</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-3"
                 :class="order.status === 'completed' ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-500'"
            >
              {{ order.status === 'completed' ? '✓' : '3' }}
            </div>
            <div>
              <p class="font-medium" :class="order.status !== 'completed' ? 'text-gray-500' : ''">
                Completed
              </p>
              <p class="text-gray-400 text-sm">{{ order.status === 'completed' ? 'Account credentials delivered' : 'Waiting for completion' }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="order.status === 'cancelled'" class="mt-6 bg-red-500/10 border border-red-500/50 rounded p-4">
          <p class="text-red-500">This order has been cancelled.</p>
        </div>
        
        <div v-else-if="order.status === 'completed'" class="mt-6 bg-green-500/10 border border-green-500/50 rounded p-4">
          <p class="text-green-500">This order has been completed.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/orderStore';

const orderStore = useOrderStore();
const route = useRoute();
const router = useRouter();

const order = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  const orderId = route.params.id;
  
  try {
    const orderData = await orderStore.getOrderById(orderId);
    
    if (orderData) {
      order.value = orderData;
    } else {
      error.value = "Order not found";
    }
  } catch (err) {
    error.value = "Failed to load order details";
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

const cancelOrder = async () => {
  const confirmed = confirm("Are you sure you want to cancel this order?");
  
  if (confirmed) {
    isLoading.value = true;
    
    try {
      const success = await orderStore.cancelOrder(order.value.id);
      
      if (success) {
        order.value = {
          ...order.value,
          status: 'cancelled'
        };
      } else {
        alert("Failed to cancel order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while cancelling your order.");
    } finally {
      isLoading.value = false;
    }
  }
};
</script>
