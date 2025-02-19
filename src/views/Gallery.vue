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

    <!-- Use vue-masonry-wall for masonry layout -->
    <vue-masonry-wall
      v-if="!loading && !error"
      :items="photos"
      class="masonry-container"
    >
      <template v-slot:default="{ item }">
        <div class="photo-item">
          <div class="relative p-1 bg-black" @click="handleClick(item)">
            <img
              :src="item.image_url"
              alt="Uploaded Image"
              class="w-full object-cover transition-all"
            />
          </div>

          <LikeIcon
            :class="{
              'text-red-500': item.liked,
              'text-gray-500': !item.liked,
            }"
            @click="handleLike(item)"
            class="cursor-pointer"
          />

          <p class="text-start font-semibold overflow-hidden text-ellipsis">
            {{ item.name }}
          </p>
        </div>
      </template>
    </vue-masonry-wall>

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
import VueMasonryWall from "@yeger/vue-masonry-wall";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import LikeIcon from "../assets/icons/LikeIcon.vue";
import PhotoForm from "../components/PhotoForm.vue";
import { supabase } from "../supabase";

const photos = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);

const router = useRouter();

const handleLike = async (photo) => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  // Optimistic UI Update: Update the liked status in the local photos array
  const updatedPhotos = photos.value.map((item) => {
    if (item.id === photo.id) {
      item.liked = !item.liked;
    }
    return item;
  });
  photos.value = updatedPhotos;

  const { data, error } = await supabase
    .from("posts")
    .update({ liked: photo.liked })
    .eq("id", photo.id)
    .eq("user_id", userData.id);

  if (error) {
    alert(error.message);
    // Revert the optimistic update if there's an error
    const revertedPhotos = photos.value.map((item) => {
      if (item.id === photo.id) {
        item.liked = !item.liked;
      }
      return item;
    });
    photos.value = revertedPhotos;
  }
};

const handleClick = (photo) => {
  router.push(`/gallery/${photo.id}`);
};

const fetchImages = async () => {
  loading.value = true;
  error.value = null;

  const { data, error: fetchError } = await supabase
    .from("posts")
    .select("id, name, description, image_url, liked");

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

<style scoped>
/* Optional styling for your items, modify as needed */
.photo-item {
  padding: 4px;
}

/* .masonry-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
} */
</style>
