<template>
  <div>
    <div class="text-white flex flex-col md:flex-row gap-6 items-stretch">
      <!-- Profile Image -->
      <div class="md:w-40 md:h-40 flex-shrink-0 bg-black p-1 items-stretch">
        <img
          :src="user.user_profile || defaultProfilePicture"
          alt="Profile Picture"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- User Information -->
      <div class="flex-1 text-black p-2">
        <h2 class="text-3xl font-bold">{{ user.name }}</h2>
        <p class="text-xl">{{ user.email }}</p>
        <p class="mt-3 text-gray-700">{{ user.bio }}</p>
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
                <div class="relative p-1 bg-black" @click="handleClick(item)">
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
                <div class="relative p-1 bg-black" @click="handleClick(item)">
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
import { useRoute, useRouter } from "vue-router";

const activeTab = ref("posts");
const photos = ref([]);
const likedPhotos = ref([]);
const loading = ref(false);
const router = useRoute();

const profileId = router.params.id;

const user = ref({
  id: "", // Add an id field to store the user's ID
  name: "Chris Coyier",
  email: "chris@example.com",
  bio: "I'm a web designer and developer. I'm the co-founder of CodePen and have written books on CSS and SVG.",
  user_profile: "",
});

const defaultProfilePicture =
  "https://img.freepik.com/free-photo/bright-neon-colors-shining-wild-chameleon_23-2151682804.jpg";

onMounted(async () => {
  const userData = profileId;

  if (userData) {
    const { data: userPostData, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", profileId);

    if (postError) {
      console.log(postError);
    } else {
      photos.value = userPostData;
    }

    const { data: userLikedData, error: likedError } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", profileId);

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
      .eq("id", profileId)
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
