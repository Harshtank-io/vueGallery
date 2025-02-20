<template>
  <div class="flex min-h-screen">
    <!-- Left side with image -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-[#1a1625]">
      <div class="absolute bottom-20 left-8 right-8 z-10">
        <h1 class="text-4xl font-medium text-white mb-2">Capturing Moments,</h1>
        <h1 class="text-4xl font-medium text-white">Creating Memories</h1>
      </div>
      <img
        src="../../assets/images/reg.jpg"
        alt="Background"
        class="object-cover w-full h-full opacity-70"
      />
    </div>

    <!-- Right side with form -->
    <div class="w-full lg:w-1/2 bg-black p-8 flex items-center justify-center">
      <div class="w-full max-w-md space-y-8">
        <div class="space-y-2">
          <h2 class="text-3xl font-semibold text-white">Create an account</h2>
          <p class="text-white/70">
            Already have an account?
            <router-link
              to="/login"
              class="text-purple-400 hover:text-purple-300"
            >
              Log in
            </router-link>
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Email Input -->
          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <!-- Username Input -->
          <div>
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <!-- Password Input -->
          <div>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full p-4 bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            class="w-full bg-white text-black py-4 hover:bg-purple-700 transition-colors"
          >
            Create account
          </button>

          <!-- Or register with -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-[#1a1625] text-white/50"
                >Or register with</span
              >
            </div>
          </div>

          <!-- Social Login Buttons -->
          <div class="grid grid-cols-1">
            <button
              type="button"
              class="flex items-center justify-center gap-2 p-4 border border-white/10 text-white hover:bg-white/5"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../supabase";

const email = ref("");
const username = ref("");
const password = ref("");
const router = useRouter();

const handleRegister = async () => {
  // Step 1: Register the user with email and password
  // const { user, error }
  const res = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: "https://viewgallery.vercel.app/",
    },
  });

  if (res.error) {
    alert(res.error.message);
  } else {
    alert("User registered");
  }

  // Step 2: Insert user info into the database if registration is successful
  const { error: insertError } = await supabase.from("users").insert([
    {
      id: res.data.user.id,
      email: email.value,
      user_name: username.value,
      created_at: new Date(),
    },
  ]);

  // Step 3: Handle insert errors (if any)
  if (insertError) {
    alert(insertError.message);
  } else {
    alert("User registered successfully! Check your email to verify.");
    router.push("/");
  }
};
</script>
