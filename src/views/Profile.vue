<template>
  <div>
    <div class="text-white flex flex-col md:flex-row gap-6 items-stretch">
      <!-- Profile Image -->
      <div
        class="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 border-4 border-black items-stretch"
      >
        <img
          :src="user.user_profile || defaultProfilePicture"
          alt="Profile Picture"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- User Information -->
      <div class="flex-1 text-black">
        <h2 class="text-3xl font-bold">{{ user.user_name }}</h2>
        <p class="text-xl">{{ user.email }}</p>
        <p class="mt-3 text-gray-700">{{ user.bio }}</p>

        <!-- Profile Actions -->
        <div class="mt-4 flex gap-3">
          <button
            @click="isEditOpen = true"
            class="cursor-pointer px-4 py-2 bg-white border text-black hover:bg-black hover:text-white transition"
          >
            Edit Profile
          </button>
          <EditProfile
            :user="user"
            :isOpen="isEditOpen"
            @close="isEditOpen = false"
            @updateUser="updateUser"
          />
        </div>
      </div>
    </div>
    <div class="mt-6">
      <div class="flex border-b border-gray-700">
        <button
          @click="activeTab = 'posts'"
          :class="[
            'px-4 py-2 font-medium',
            activeTab === 'posts'
              ? 'text-black border-b-2 '
              : 'text-gray-400 hover:text-gray-200',
          ]"
        >
          Posts
        </button>
        <button
          @click="activeTab = 'likes'"
          :class="[
            'px-4 py-2 font-medium',
            activeTab === 'likes'
              ? 'text-black border-b-2'
              : 'text-gray-400 hover:text-gray-200',
          ]"
        >
          Likes
        </button>
      </div>

      <div class="mt-4">
        <div v-if="activeTab === 'posts'" class="">
          <vue-masonry-wall
            v-if="!loading"
            :items="photos"
            class="masonry-container"
          >
            <template v-slot:default="{ item }">
              <div class="p-1">
                <div class="relative p-1 bg-black">
                  <img
                    :src="item.image_url"
                    alt="Uploaded Image"
                    class="w-full object-cover transition-all"
                  />
                </div>

                <p
                  class="text-start font-semibold overflow-hidden text-ellipsis"
                >
                  {{ item.name }}
                </p>
              </div>
            </template>
          </vue-masonry-wall>
        </div>

        <div v-else-if="activeTab === 'likes'">
          <vue-masonry-wall
            v-if="!loading"
            :items="likedPhotos"
            class="masonry-container"
          >
            <template v-slot:default="{ item }">
              <div class="p-1">
                <div class="relative p-1 bg-black">
                  <img
                    :src="item.image_url"
                    alt="Uploaded Image"
                    class="w-full object-cover transition-all"
                  />
                </div>

                <p
                  class="text-start font-semibold overflow-hidden text-ellipsis"
                >
                  {{ item.name }}
                </p>
              </div>
            </template>
          </vue-masonry-wall>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VueMasonryWall from "@yeger/vue-masonry-wall";
import { onMounted, ref } from "vue";
import { supabase } from "../supabase";
import EditProfile from "../components/EditProfile.vue";
import logo from "../assets/icons/logo.png";

const activeTab = ref("posts");
const photos = ref([]);
const likedPhotos = ref([]);
const loading = ref(false);
const isEditOpen = ref(false);

const user = ref({
  name: "Chris Coyier",
  email: "chris@example.com",
  bio: "I'm a web designer and developer. I'm the co-founder of CodePen and have written books on CSS and SVG.",
  user_profile: "",
});

const defaultProfilePicture = logo;

onMounted(async () => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  if (userData) {
    const { data: userPostData, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userData.id);

    if (postError) {
      console.log(postError);
    } else {
      photos.value = userPostData;
    }

    const { data: userLikedData, error: likedError } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", userData.id);

    const { data: allPosts, error: allPostsError } = await supabase
      .from("posts")
      .select("*");

    if (allPostsError) {
      console.log(allPostsError);
    }

    const likedPostIds = allPosts.filter((post) =>
      userLikedData.some((like) => like.post_id === post.id)
    );

    if (likedError) {
      console.log(likedError);
    } else {
      likedPhotos.value = likedPostIds;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userData.id)
      .single();
    if (!error && data) {
      user.value = data;
    }
  }
});
</script>

<style scoped>
.container {
  background-color: #1a1a1a;
}
</style>
