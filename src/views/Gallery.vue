<template>
  <SearchBar />
  <div class="container relative mx-auto flex flex-col">
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <!-- Skeleton Loader -->
      <div v-for="n in 8" :key="n" class="p-1 bg-gray-200 shadow-lg">
        <div class="h-48 bg-gray-300 animate-pulse"></div>
        <div class="mt-4">
          <div class="h-6 bg-gray-300 animate-pulse rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 animate-pulse rounded mt-2 w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <vue-masonry-wall
      v-if="!loading && !error"
      :items="photos"
      class="masonry-container"
    >
      <template v-slot:default="{ item }">
        <div class="p-1">
          <div
            class="relative p-1 bg-black cursor-pointer"
            @click="handleVisit(item)"
          >
            <img
              :src="item.image_url"
              :style="
                item.filter
                  ? {
                      filter: `contrast(${item.filter.contrast}%) brightness(${item.filter.brightness}%) saturate(${item.filter.saturation}%)`,
                    }
                  : ''
              "
              alt="Uploaded Image"
              class="w-full object-cover transition-all"
            />
          </div>

          <div class="flex items-center gap-2 cursor-pointer">
            <LikeIcon
              :class="item.liked ? 'text-red-500' : 'text-gray-500'"
              @click="item.liked ? handleUnliked(item) : handleLike(item)"
              class="cursor-pointer"
            />
            {{ item.likes.length }}
            <p>likes</p>

            <CommentIcon @click="toggleCommentBox(item)" />
          </div>

          <p class="text-start font-semibold overflow-hidden text-ellipsis">
            {{ item.name }}
          </p>

          <!-- Comments -->
          <div v-if="item.isCommentOpen" class="mt-2">
            <div class="flex items-center gap-2">
              <input
                v-model="item.commentText"
                placeholder="Write a comment..."
                class="border p-2 w-full"
              />
              <button
                @click="handleComment(item)"
                class="bg-black text-white p-2"
              >
                <SendIcon />
              </button>
            </div>
            <div v-if="item.comments && item.comments.length > 0" class="mt-4">
              <p class="font-semibold">Comments:</p>
              <div
                v-for="comment in item.comments"
                :key="comment.id"
                class="mt-2"
              >
                <p>
                  <strong>{{ comment.users.user_name }}</strong
                  >: {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </vue-masonry-wall>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 max-w-md w-full h-[80vh] overflow-y-auto">
        <h3 class="text-xl font-semibold mb-4">Add New Photo</h3>
        <PhotoForm @imageUploaded="handleImageUploaded" />
        <button
          @click="closeModal"
          class="mt-4 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>

    <button
      @click="openModal"
      class="mb-8 px-4 py-2 bg-black text-white hover:bg-gray-800 transition sticky bottom-5 self-center"
    >
      <PlusIcon />
    </button>
  </div>
</template>

<script setup>
import VueMasonryWall from "@yeger/vue-masonry-wall";
import { PlusIcon, SendIcon } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CommentIcon from "../assets/icons/CommentIcon.vue";
import LikeIcon from "../assets/icons/LikeIcon.vue";
import PhotoForm from "../components/PhotoForm.vue";
import { supabase } from "../supabase";
import SearchBar from "../components/SearchBar.vue";

const red = {
  color: "red",
};

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

const handleComment = async (photo) => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  const { data: commentData, error: commentError } = await supabase
    .from("comments")
    .insert([
      {
        post_id: photo.id,
        user_id: userData.id,
        content: photo.commentText,
        created_at: new Date().toISOString(),
      },
    ]);

  if (commentError) {
    alert(commentError.message);
  } else {
    photo.comments.push(commentData);
    photo.commentText = "";
  }
};

const toggleCommentBox = (photo) => {
  photo.isCommentOpen = !photo.isCommentOpen;
};

// Fetch images and comments
const fetchImages = async () => {
  loading.value = true;
  error.value = null;

  const { data, error: fetchError } = await supabase
    .from("posts")
    .select("id, name, description, image_url, user_id, filter,likes(post_id)");

  if (fetchError) {
    error.value = "Error fetching images!";
  } else {
    photos.value = data;
    await fetchComments();
  }

  loading.value = false;
  fetchLikes();
};

const fetchComments = async () => {
  const { data: commentsData, error } = await supabase
    .from("comments")
    .select("id, post_id, user_id, content, users(id, user_name)")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  photos.value.forEach((photo) => {
    photo.comments = commentsData.filter(
      (comment) => comment.post_id === photo.id
    );
  });
};

const openModal = () => {
  isModalOpen.value = true;
};

const handleVisit = (photo) => {
  const profileId = photo.user_id || photo.id;
  router.push(`/profile/${profileId}`);
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleImageUploaded = () => {
  fetchImages();
  closeModal();
};

onMounted(() => {
  fetchImages();
});
</script>
