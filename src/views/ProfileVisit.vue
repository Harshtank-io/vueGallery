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
            v-if="user.isFollowing"
            @click="handleUnfollow(user)"
            class="mt-4"
          >
            Unfollow
          </button>
          <button v-else @click="handleFollow(user)" class="mt-4">
            Follow
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
const router = useRoute();
const profileId = router.params.id;

const handleFollow = async (user) => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  const { data: existingFollow, error: checkError } = await supabase
    .from("follower")
    .select("*")
    .match({
      user_id: userData.id,
      following_id: user.id,
    });

  if (checkError) {
    alert(checkError.message);
    return;
  }

  if (existingFollow.length === 0) {
    const { data: followData, error: followError } = await supabase
      .from("follower")
      .insert([
        {
          user_id: userData.id,
          following_id: user.id,
          created_at: new Date().toISOString(),
        },
      ]);

    if (followError) {
      alert(followError.message);
    } else {
      user.isFollowing = true;
    }
  } else {
    alert("You are already following this user.");
  }
};

const handleUnfollow = async (user) => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  const { data: unfollowData, error: unfollowError } = await supabase
    .from("follower")
    .delete()
    .match({ user_id: userData.id, following_id: user.id });

  if (unfollowError) {
    alert(unfollowError.message);
  } else {
    user.isFollowing = false;
  }
};

const fetchUserData = async () => {
  try {
    const { data: currentUser, error: currentUserError } =
      await supabase.auth.getUser();
    if (currentUserError) throw currentUserError;

    isItMe.value = currentUser.user.id === profileId;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", profileId)
      .single();
    if (userError) {
      console.error(userError);
    } else {
      user.value = userData;
    }

    const { data: userPostData, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", profileId);

    if (postError) {
      console.error(postError);
    } else {
      photos.value = userPostData;
    }

    const { data: userFollowers, error: followersError } = await supabase
      .from("follower")
      .select("*")
      .eq("following_id", profileId);

    if (followersError) {
      console.error(followersError);
    } else {
      const isAlreadyFollowing = userFollowers.some(
        (follower) => follower.follower_id === currentUser.user.id
      );
      user.value.isFollowing = isAlreadyFollowing;
    }

    const { data: userLikedData, error: likedError } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", profileId);

    if (likedError) {
      console.error(likedError);
    } else {
      const { data: allPosts, error: allPostsError } = await supabase
        .from("posts")
        .select("*");

      if (allPostsError) {
        console.error(allPostsError);
      } else {
        likedPhotos.value = allPosts.filter((post) =>
          userLikedData.some((like) => like.post_id === post.id)
        );
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
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
