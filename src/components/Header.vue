<template>
  <div class="border-b-1 py-4 md:py-8">
    <nav
      class="flex justify-between items-center md:text-2xl text-xl px-4 md:px-0"
    >
      <!-- Logo or brand name -->
      <div class="text-xl font-bold">viewGallery</div>

      <!-- Hamburger menu for mobile -->
      <button @click="toggleMobileMenu" class="md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            v-if="!isMobileMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Desktop navigation -->
      <div class="hidden md:flex items-center justify-between gap-6">
        <router-link
          v-for="nav in filteredNavs"
          :key="nav.name"
          :to="nav.path"
          class="text-gray-700"
          :class="{ 'border-t-1': isActive(nav.path) }"
        >
          {{ nav.name }}
        </router-link>
      </div>

      <!-- Desktop auth buttons -->
      <div class="hidden md:flex items-center gap-4">
        <button
          v-if="!isUserValid"
          @click="handleLogin"
          class="border-2 py-2 px-8 bg-black hover:bg-purple-700 hover:text-black hover:border-black text-white transition"
        >
          Login
        </button>

        <template v-else>
          <button
            @click="handleLogout"
            class="border-2 py-1 px-4 bg-black hover:bg-white hover:text-black text-white transition"
          >
            Logout
          </button>
          <PrimaryButton @click="handleProfile">Profile</PrimaryButton>
        </template>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden mt-4 px-4">
      <div class="flex flex-col gap-4">
        <router-link
          v-for="nav in filteredNavs"
          :key="nav.name"
          :to="nav.path"
          class="text-gray-700"
          :class="{ 'font-bold': isActive(nav.path) }"
          @click="closeMobileMenu"
        >
          {{ nav.name }}
        </router-link>
        <button
          v-if="!isUserValid"
          @click="handleLogin"
          class="border-2 py-2 px-8 bg-black hover:bg-purple-700 hover:text-black hover:border-black text-white transition"
        >
          Login
        </button>
        <template v-else>
          <button
            @click="handleLogout"
            class="border-2 py-1 px-4 bg-black hover:bg-white hover:text-black text-white transition"
          >
            Logout
          </button>
          <PrimaryButton @click="handleProfile">Profile</PrimaryButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "../supabase";
import PrimaryButton from "./buttons/PrimaryButton.vue";

const navs = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery", requiresAuth: true },
  { name: "About", path: "/about" },
  { name: "Contact Us", path: "/contact-us" },
];

const router = useRouter();
const route = useRoute();
const isUserValid = ref(false);
const isMobileMenuOpen = ref(false);

const checkUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  isUserValid.value = !!user;
};

const filteredNavs = computed(() => {
  return navs.filter((nav) => !nav.requiresAuth || isUserValid.value);
});

const handleLogin = () => {
  router.push("/login");
  closeMobileMenu();
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  isUserValid.value = false;
  router.push("/");
  closeMobileMenu();
};

const handleProfile = () => {
  router.push("/profile");
  closeMobileMenu();
};

const isActive = (path) => {
  return route.path === path;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(async () => {
  await checkUser();

  supabase.auth.onAuthStateChange((event, session) => {
    isUserValid.value = !!session;
  });
});
</script>
