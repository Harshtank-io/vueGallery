<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <div v-else>
    <h2 class="text-2xl font-bold mb-4">{{ data.name }}</h2>
    <div class="w-full">
      <img
        :src="data.image_url"
        alt="Image"
        class="w-64 h-64 object-cover cursor-pointer"
        @click="openModal"
      />
    </div>
    <p class="mt-2 text-lg">{{ data.description }}</p>

    <!-- Popup Modal for Image -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 backdrop-blur-sm bg-black/10 bg-opacity-50 flex justify-center items-center z-50"
      @click="closeModal"
    >
      <div class="bg-black p-4 space-y-2">
        <img :src="data.image_url" alt="Image" class="w-96 h-96 object-cover" />
        <div class="w-full flex justify-end gap-2">
          <button
            @click="closeModal"
            class="bg-white text-black py-2 px-4 flex items-center justify-center cursor-pointer"
          >
            close
          </button>
          <button
            @click="handleSave"
            class="bg-white text-black py-2 px-4 flex items-center justify-center cursor-pointer hover:bg-purple-700"
          >
            save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabase";

const route = useRoute();
const id = route.params.id;
const data = ref(null);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  const { data: record, error: fetchError } = await supabase
    .from("posts") // Replace with your table name
    .select("*") // Fetch all columns
    .eq("id", id) // Filter by ID
    .single(); // Get a single record

  if (fetchError) {
    error.value = "Error fetching data!";
  } else {
    data.value = record;
  }

  loading.value = false;
};

const handleSave = async (e) => {
  if (data.value && data.value.image_url) {
    const imageUrl = data.value.image_url;
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();

      const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("There was a problem with the download:", error);
    }
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(fetchData);
</script>
