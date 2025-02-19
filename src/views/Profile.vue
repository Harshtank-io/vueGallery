<template>
  <div>
    <div class="text-white flex flex-col md:flex-row gap-6 items-stretch">
      <!-- Profile Image -->
      <div class="md:w-40 md:h-40 flex-shrink-0 bg-black p-1">
        <img
          :src="user.user_profile || defaultProfilePicture"
          alt="Profile Picture"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- User Information -->
      <div class="flex-1 bg-black p-2">
        <h2 class="text-3xl font-bold">{{ user.name }}</h2>
        <p class="text-xl">{{ user.email }}</p>
        <p class="mt-3 text-gray-300">{{ user.bio }}</p>

        <!-- Profile Actions -->
        <div class="mt-4 flex gap-3">
          <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition">
            Edit Profile
          </button>
          <label
            class="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 transition"
          >
            Upload Picture
            <input
              type="file"
              @change="uploadProfilePicture"
              accept="image/*"
              class="hidden"
            />
          </label>
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
            v-if="!loading && !error"
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

                <LikeIcon
                  :class="{
                    'text-red-500': item.liked,
                    'text-gray-500': !item.liked,
                  }"
                  @click="handleLike(item)"
                  class="cursor-pointer"
                />
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
import LikeIcon from "../assets/icons/LikeIcon.vue";
import { supabase } from "../supabase";

const activeTab = ref("posts");
const photos = ref([]);
const likedPhotos = ref([]);

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
      .from("posts")
      .select("*")
      .eq("user_id", userData.id)
      .eq("liked", true);

    if (likedError) {
      console.log(likedError);
    } else {
      likedPhotos.value = userLikedData;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userData.id)
      .single();
    if (!error && data) {
      user.value = data; // Ensure user has the ID field
    }
  }
});

const uploadProfilePicture = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Ensure user.id is set
  if (!user.value.id) {
    console.error("User ID is not available");
    return;
  }

  const fileName = `${user.value.id}/profile-pic.${file.name.split(".").pop()}`;
  const { data, error } = await supabase.storage
    .from("user_profiles")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading file:", error);
    return;
  }

  const { data: publicURL, error: urlError } = supabase.storage
    .from("user_profiles")
    .getPublicUrl(data.path);

  console.log(data.path);

  if (urlError) {
    console.error("Error getting public URL:", urlError);
    return;
  }
  console.log(publicURL.publicUrl);

  // Save the URL of the profile picture in the 'user_profile' column
  const { error: updateError } = await supabase
    .from("users")
    .update({ user_profile: publicURL.publicUrl })
    .eq("id", user.value.id);

  if (updateError) {
    console.error("Error updating profile picture:", updateError);
  } else {
    user.value.user_profile = publicURL; // Update the profile picture in the UI
  }
};
</script>

<style scoped>
.container {
  background-color: #1a1a1a;
}
</style>
