<template>
  <div class="min-h-screen flex flex-col">
    <header class="w-full bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <footer class="w-full bg-black">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </footer>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
</script>
