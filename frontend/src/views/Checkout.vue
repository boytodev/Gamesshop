
<template>
  <div v-if="isLoading" class="gaming-card animate-pulse">
    <div class="h-10 bg-gaming-blue/20 rounded w-1/2 mb-6"></div>
    <div class="h-60 bg-gaming-blue/20 rounded mb-6"></div>
    <div class="h-10 bg-gaming-blue/20 rounded w-full"></div>
  </div>
  
  <div v-else-if="error" class="gaming-card">
    <p class="text-red-500 mb-4">{{ error }}</p>
    <router-link to="/marketplace" class="text-gaming-cyan hover:underline">
      Back to Marketplace
    </router-link>
  </div>
  
  <div v-else-if="game" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
      <div class="gaming-card">
        <h1 class="text-2xl font-bold mb-6">Checkout</h1>
        
        <h2 class="text-xl font-bold mb-4">Payment Method</h2>
        <div class="mb-8">
          <div class="flex items-center space-x-4 mb-4">
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="Credit Card" 
                v-model="paymentMethod"
                class="form-radio text-gaming-cyan h-5 w-5 mr-2"
              />
              Credit Card
            </label>
            
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="PayPal" 
                v-model="paymentMethod"
                class="form-radio text-gaming-cyan h-5 w-5 mr-2"
              />
              PayPal
            </label>
          </div>
          
          <div v-if="paymentMethod === 'Credit Card'" class="space-y-4">
            <div>
              <label for="cardNumber" class="block text-sm font-medium mb-1">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text" 
                v-model="cardNumber"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="expiryDate" class="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text" 
                  v-model="expiryDate"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
                  placeholder="MM/YY"
                />
              </div>
              
              <div>
                <label for="cvv" class="block text-sm font-medium mb-1">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text" 
                  v-model="cvv"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gaming-cyan"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
          
          <div v-if="paymentMethod === 'PayPal'" class="p-4 bg-gray-700 rounded border border-gray-600">
            <p>You will be redirected to PayPal to complete your payment after you place your order.</p>
          </div>
        </div>
        
        <div class="border-t border-gray-700 pt-6">
          <button 
            @click="placeOrder" 
            class="btn-accent w-full"
            :disabled="isProcessing"
          >
            {{ isProcessing ? "Processing..." : `Pay $${game.price}` }}
          </button>
          
          <p class="text-sm text-gray-400 mt-4 text-center">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
    
    <div class="lg:col-span-1">
      <div class="gaming-card sticky top-4">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
        
        <div class="flex space-x-4 mb-6">
          <div class="w-20 h-20 bg-gaming-blue/20 rounded overflow-hidden">
            <img :src="game.imageUrl" :alt="game.title" class="w-full h-full object-cover" />
          </div>
          
          <div>
            <h3 class="font-bold">{{ game.title }}</h3>
            <p class="text-gray-400 text-sm">Level {{ game.level }} · {{ game.game }}</p>
            <p class="text-gaming-cyan font-bold mt-1">${{ game.price }}</p>
          </div>
        </div>
        
        <div class="border-t border-gray-700 pt-4">
          <div class="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${{ game.price }}</span>
          </div>
          
          <div class="flex justify-between mb-2">
            <span>Processing Fee</span>
            <span>$0.00</span>
          </div>
          
          <div class="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-700">
            <span>Total</span>
            <span>${{ game.price }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const game = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isProcessing = ref(false);

const paymentMethod = ref('Credit Card');
const cardNumber = ref('');
const expiryDate = ref('');
const cvv = ref('');

onMounted(async () => {
  const gameId = route.params.gameId;
  
  try {
    const gameData = await gameStore.getGameIdById(gameId);
    
    if (gameData) {
      game.value = gameData;
    } else {
      error.value = "Game ID not found";
    }
  } catch (err) {
    error.value = "Failed to load game details";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const placeOrder = async () => {
  if (!authStore.user) {
    router.push('/login');
    return;
  }
  
  isProcessing.value = true;
  
  try {
    const order = await orderStore.createOrder(
      game.value,
      authStore.user.id,
      paymentMethod.value
    );
    
    if (order) {
      router.push(`/order/${order.id}`);
    } else {
      error.value = "Failed to place order";
    }
  } catch (err) {
    error.value = "An error occurred while placing your order";
    console.error(err);
  } finally {
    isProcessing.value = false;
  }
};
</script>
