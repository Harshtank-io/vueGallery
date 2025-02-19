<template>
  <footer class="bg-black text-white py-16">
    <div
      class="max-w-7xl mx-auto grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
    >
      <!-- Developers Column -->
      <nav aria-labelledby="developers-heading">
        <h3 id="developers-heading" class="text-sm font-semibold mb-6">
          Developers
        </h3>
        <ul class="space-y-3">
          <li v-for="link in developerLinks" :key="link">
            <a
              :href="`${link.toLowerCase().replace(/\s+/g, '-')}`"
              class="text-gray-400 hover:text-white text-sm transition-colors"
              >{{ link }}</a
            >
          </li>
        </ul>
      </nav>

      <!-- Company Column -->
      <nav aria-labelledby="company-heading">
        <h3 id="company-heading" class="text-sm font-semibold mb-6">Company</h3>
        <ul class="space-y-3">
          <li v-for="link in companyLinks" :key="link">
            <a
              :href="`${link.toLowerCase()}`"
              class="text-gray-400 hover:text-white text-sm transition-colors"
              >{{ link }}</a
            >
          </li>
        </ul>
      </nav>

      <!-- Social & Contact Column -->
      <div class="col-span-2 sm:col-span-1">
        <nav aria-labelledby="social-heading" class="mb-8">
          <h3 id="social-heading" class="text-sm font-semibold mb-6">Social</h3>
          <ul class="space-y-3">
            <li v-for="link in socialLinks" :key="link">
              <a
                :href="`https://${link.toLowerCase()}.com`"
                class="text-gray-400 hover:text-white text-sm transition-colors"
                >{{ link }}</a
              >
            </li>
          </ul>
        </nav>
      </div>

      <div class="space-y-4">
        <ContactButton v-for="type in contactTypes" :key="type" :type="type" />
      </div>
    </div>
  </footer>
</template>

<script setup>
import { defineComponent, h } from "vue";
import { ArrowUpRight } from "lucide-vue-next";

const developerLinks = [
  "Documentation",
  "Tutorials",
  "Open source examples",
  "API Status",
  "What's new?",
];
const companyLinks = ["About", "Careers", "Pricing", "Legal"];
const socialLinks = ["Twitter", "Instagram", "GitHub"];
const contactTypes = ["Sales", "Support"];

const ContactButton = defineComponent({
  props: {
    type: String,
  },
  setup(props) {
    return () =>
      h(
        "a",
        {
          href: "#",
          class:
            "group flex items-center justify-between px-4 py-3 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors",
        },
        [
          h("span", { class: "text-sm" }, `Contact ${props.type}`),
          h(ArrowUpRight, {
            class:
              "h-4 w-4 text-gray-400 group-hover:text-white transition-colors",
          }),
        ]
      );
  },
});
</script>
