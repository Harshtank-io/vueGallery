<template>
  <div>
    <div class="text-white flex flex-col md:flex-row gap-6 items-stretch">
      <!-- Profile Image -->
      <div
        class="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 border-2 border-black items-stretch"
      >
        <img
          :src="user.user_profile || defaultProfilePicture"
          alt="Profile Picture"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- User Information -->
      <div class="flex-1 text-black p-2">
        <div>
          <h2 class="text-3xl font-bold">{{ user.user_name }}</h2>
          <p class="text-xl">{{ user.email }}</p>
          <p class="mt-3 text-gray-700">{{ user.bio }}</p>
        </div>
        <div v-if="!isItMe">
          <button
            @click="user.isFollowing ? handleUnfollow() : handleFollow()"
            class="mt-4 px-4 py-2 transition-colors duration-200 border"
            :class="{
              'bg-white hover:bg-black hover:text-white text-black':
                user.isFollowing,
              'bg-black hover:bg-white hover:text-black text-white ':
                !user.isFollowing,
            }"
            :disabled="loadingFollow"
          >
            {{ user.isFollowing ? "Unfollow" : "Follow" }}
            <span v-if="loadingFollow" class="ml-2 animate-spin">↻</span>
          </button>
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
              ? 'text-black border-b-2'
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
        <div v-if="activeTab === 'posts'">
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
import { useRoute } from "vue-router";
import logo from "../assets/icons/logo.png";

const activeTab = ref("posts");
const photos = ref([]);
const likedPhotos = ref([]);
const loading = ref(false);
const loadingFollow = ref(false); // New loading state for follow/unfollow
const isItMe = ref(false);
const user = ref({
  id: "",
  user_name: "Chris Coyier",
  email: "chris@example.com",
  bio: "I am a web designer and developer. I co-founded CodePen and wrote books on CSS and SVG.",
  user_profile: "",
  isFollowing: false,
});

const defaultProfilePicture = logo;
const route = useRoute(); // Changed from router to route
const profileId = route.params.id;

const handleFollow = async () => {
  try {
    loadingFollow.value = true;
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const { error: followError } = await supabase.from("follower").insert({
      user_id: currentUser.id,
      following_id: profileId,
      created_at: new Date().toISOString(),
    });

    if (followError) {
      alert(followError.message);
      return;
    }

    user.value.isFollowing = true;
  } catch (error) {
    alert("Error following user: " + error.message);
  } finally {
    loadingFollow.value = false;
  }
};

const handleUnfollow = async () => {
  try {
    loadingFollow.value = true;
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    const { error: unfollowError } = await supabase
      .from("follower")
      .delete()
      .match({
        user_id: currentUser.id,
        following_id: profileId,
      });

    if (unfollowError) {
      alert(unfollowError.message);
      return;
    }

    user.value.isFollowing = false;
  } catch (error) {
    alert("Error unfollowing user: " + error.message);
  } finally {
    loadingFollow.value = false;
  }
};

const fetchUserData = async () => {
  try {
    loading.value = true;
    const { data: currentUser } = await supabase.auth.getUser();

    isItMe.value = currentUser.user.id === profileId;

    // Fetch user data
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", profileId)
      .single();

    if (userData) {
      user.value = { ...userData, isFollowing: false };
    }

    // Check if current user is following profile
    const { data: followerData } = await supabase
      .from("follower")
      .select("*")
      .eq("user_id", currentUser.user.id)
      .eq("following_id", profileId);

    user.value.isFollowing = followerData.length > 0;

    // Fetch posts and likes (unchanged from original)
    const { data: userPostData } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", profileId);
    photos.value = userPostData || [];

    const { data: userLikedData } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", profileId);

    if (userLikedData?.length) {
      const { data: allPosts } = await supabase.from("posts").select("*");
      likedPhotos.value = allPosts.filter((post) =>
        userLikedData.some((like) => like.post_id === post.id)
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.container {
  background-color: #1a1a1a;
}
</style>
