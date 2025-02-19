<template>
  <div class="border-b-1 py-8">
    <nav class="flex justify-between items-center md:text-2xl text-xl">
      <div class="flex items-center justify-between gap-6">
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
      <div class="flex items-center gap-4">
        <button
          v-if="!isUserValid"
          @click="handleLogin"
          class="border-2 py-2 px-8 bg-black hover:bg-purple-700 hover:text-black hover:border-black text-white transition"
        >
          Login
        </button>

        <button
          v-else
          @click="handleLogout"
          class="border-2 py-2 px-8 bg-black hover:bg-white hover:text-black text-white transition"
        >
          Logout
        </button>

        <!-- User Profile Button -->
        <button
          v-if="isUserValid"
          @click="handleProfile"
          class="border-2 py-2 px-8 bg-gray-200 hover:bg-purple-700 hover:text-black text-black transition"
        >
          Profile
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "../supabase";

const navs = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery", requiresAuth: true },
  { name: "About", path: "/about" },
  { name: "Contact Us", path: "/contact-us" },
];

const router = useRouter();
const route = useRoute();
const isUserValid = ref(false);

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
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  isUserValid.value = false;
  router.push("/");
};

const handleProfile = () => {
  router.push("/profile");
};

const isActive = (path) => {
  return route.path === path;
};

onMounted(async () => {
  await checkUser();

  supabase.auth.onAuthStateChange((event, session) => {
    isUserValid.value = !!session;
  });
});
</script>
