<template>
  <div
    class="flex flex-col gap-12 justify-center h-[calc(100vh-20vh)] text-gray-900"
  >
    <div class="text-2xl py-4 border-gray-600 border-b">
      <p>
        Based in India → <span class="font-semi bold">{{ currentTime }}</span>
      </p>
    </div>

    <div>
      <h1 class="text-6xl font-bold">Welcome to the Vue Gallery!</h1>

      <div class="mt-6 space-y-2 text-lg">
        <p>
          Little about →
          <span class="font-semibold">Station for the Photography </span>
        </p>
      </div>
    </div>
  </div>
  <img src="../assets/images/bg-hero.jpg" alt="Vue Gallery" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref(new Date().toLocaleTimeString());

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

let interval;
onMounted(() => {
  interval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
