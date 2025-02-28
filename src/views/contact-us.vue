<!-- ContactUs.vue -->
<template>
  <div class="min-h-screen bg-white text-black">
    <!-- Header -->
    <header class="border-b border-black py-4">
      <h1 class="text-2xl font-bold">Contact Us</h1>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto py-8">
      <!-- Contact Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium mb-1"
              >Name</label
            >
            <input
              v-model="form.name"
              type="text"
              id="name"
              class="w-full border border-black p-2 focus:outline-none focus:border-black"
              placeholder="Your Name"
              required
            />
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium mb-1"
              >Email</label
            >
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="w-full border border-black p-2 focus:outline-none focus:border-black"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <!-- Subject Field -->
        <div>
          <label for="subject" class="block text-sm font-medium mb-1"
            >Subject</label
          >
          <input
            v-model="form.subject"
            type="text"
            id="subject"
            class="w-full border border-black p-2 focus:outline-none focus:border-black"
            placeholder="Subject of your message"
            required
          />
        </div>

        <!-- Message Field -->
        <div>
          <label for="message" class="block text-sm font-medium mb-1"
            >Message</label
          >
          <textarea
            v-model="form.message"
            id="message"
            rows="6"
            class="w-full border border-black p-2 focus:outline-none focus:border-black"
            placeholder="Your message here"
            required
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            class="bg-black text-white px-6 py-2 border border-black hover:bg-white hover:text-black transition-colors duration-200"
          >
            Send Message
          </button>
        </div>
      </form>

      <!-- Contact Information -->
      <div
        class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-black pt-6"
      >
        <div>
          <h3 class="text-lg font-semibold mb-2">Email</h3>
          <p>contact@example.com</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-black p-4 text-center">
      <p>© 2025 Your Company. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Reactive form state
const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

// Form submission handler
const submitForm = () => {
  console.log("Form submitted:", form.value);
  // Reset form after submission
  form.value = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
  alert("Message sent successfully!");
};
</script>
