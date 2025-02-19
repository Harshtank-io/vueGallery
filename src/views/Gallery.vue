<template>
  <div class="container mx-auto">
    <button
      @click="openModal"
      class="mb-8 px-4 py-2 bg-black text-white hover:bg-gray-800 transition"
    >
      Add your story
    </button>

    <h2 class="text-2xl font-semibold mb-4">Stories</h2>

    <div v-if="loading">Loading images...</div>

    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div v-for="photo in photos" :key="photo.id" @click="handleClick(photo)">
        <div class="p-1 bg-black">
          <img
            :src="photo.image_url"
            alt="Uploaded Image"
            class="w-full object-cover transition-all"
          />
        </div>
        <p class="text-start font-semibold overflow-hidden text-ellipsis">
          {{ photo.name }}
        </p>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">Add New Photo</h3>
        <PhotoForm @imageUploaded="handleImageUploaded" />
        <button
          @click="closeModal"
          class="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";
import PhotoForm from "../components/PhotoForm.vue";
import { useRouter } from "vue-router";

const photos = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);

const router = useRouter();

const handleClick = (photo) => {
  router.push(`/gallery/${photo.id}`);
};

const fetchImages = async () => {
  loading.value = true;
  error.value = null;

  const { data, error: fetchError } = await supabase
    .from("posts")
    .select("id, name, description, image_url");
  // .order("created_at", { ascending: false });

  if (fetchError) {
    error.value = "Error fetching images!";
  } else {
    photos.value = data;
  }

  loading.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleImageUploaded = () => {
  fetchImages();
  closeModal();
};

onMounted(fetchImages);
</script>
