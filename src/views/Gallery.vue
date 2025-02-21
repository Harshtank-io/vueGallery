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

    <vue-masonry-wall
      v-if="!loading && !error"
      :items="photos"
      class="masonry-container"
    >
      <template v-slot:default="{ item }">
        <div class="p-1">
          <div class="relative p-1 bg-black" @click="handleClick(item)">
            <img
              :src="item.image_url"
              alt="Uploaded Image"
              class="w-full object-cover transition-all"
            />
          </div>

          <div class="flex items-center gap-2">
            <LikeIcon
              :class="item.liked ? 'text-red-500' : 'text-gray-500'"
              @click="item.liked ? handleUnliked(item) : handleLike(item)"
              class="cursor-pointer"
            />
            {{ item.likes.length }}
            <p>likes</p>

            <!-- <CommentIcon />   -->
          </div>

          <p class="text-start font-semibold overflow-hidden text-ellipsis">
            {{ item.name }}
          </p>
        </div>
      </template>
    </vue-masonry-wall>

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
import VueMasonryWall from "@yeger/vue-masonry-wall";
import LikeIcon from "../assets/icons/LikeIcon.vue";
import CommentIcon from "../assets/icons/CommentIcon.vue";

const photos = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);

const router = useRouter();

// Fetch the likes from the 'likes' table and set the 'liked' property on each photo
const fetchLikes = async () => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  if (userData) {
    // Fetch liked posts for the current user
    const { data: likesData, error: fetchLikesError } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userData.id);

    if (fetchLikesError) {
      alert(fetchLikesError.message);
    }

    // Add a 'liked' property to each photo based on the liked posts
    photos.value.forEach((photo) => {
      const isLiked = likesData.some((like) => like.post_id === photo.id);
      photo.liked = isLiked;
    });
  }
};

// Handle like action
const handleLike = async (photo) => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  const { data: likePostData, error: insertError } = await supabase
    .from("likes")
    .insert([
      {
        post_id: photo.id,
        user_id: userData.id,
        created_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    alert(insertError.message);
  } else {
    photo.liked = true;
  }
};

// Handle unlike action
const handleUnliked = async (photo) => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  const { data: unLikePostData, error: deleteError } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", photo.id)
    .eq("user_id", userData.id);

  if (deleteError) {
    alert(deleteError.message);
  } else {
    photo.liked = false;
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
    .select("id, name, description, image_url,likes(post_id) ");

  if (fetchError) {
    error.value = "Error fetching images!";
  } else {
    photos.value = data;
  }

  loading.value = false;
  fetchLikes();
};

// Open the modal
const openModal = () => {
  isModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Handle image upload success
const handleImageUploaded = () => {
  fetchImages();
  closeModal();
};

onMounted(() => {
  fetchImages();
});
</script>
