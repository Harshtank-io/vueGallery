<template>
  <div class="p-1 sticky top-2 z-10 bg-white">
    <div class="p-1 flex items-center border border-gray-300">
      <input
        type="text"
        placeholder="Search..."
        class="w-full p-2 border-none outline-none"
        v-model="searchQuery"
      />
      <button
        @click="handleSearch(searchQuery)"
        class="bg-black text-white p-2 hover:bg-white hover:text-black border transition duration-200"
      >
        <SearchIcon />
      </button>
    </div>

    <div v-if="searchedUsers.length > 0" class="mt-4 border border-gray-300">
      <ul>
        <li
          v-for="user in searchedUsers"
          :key="user.id"
          class="flex items-center border-b border-gray-200 p-2"
          @click="handleVisit(user)"
        >
          <img
            :src="user.user_profile || previewImage"
            alt="Profile photo"
            class="w-10 h-10 mr-3"
          />
          <span class="font-semibold">{{ user.user_name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../supabase";
import SearchIcon from "../assets/icons/SearchIcon.vue";
import logo from "../assets/icons/logo.png";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const searchedUsers = ref([]);
const previewImage = logo;

const router = useRouter();
// Search functionality
const handleSearch = async (val) => {
  if (val === "") {
    alert("Search term is empty.");
    searchedUsers.value = [];
    return;
  }

  try {
    const { data: searchResults, error: searchError } = await supabase
      .from("users")
      .select("*")
      .ilike("user_name", `%${val}%`);

    if (searchError) {
      console.log(searchError);
      return;
    }

    searchedUsers.value = searchResults;
  } catch (error) {
    console.error("Error occurred during search:", error);
  }
};

// Handle visiting a user's profile
const handleVisit = (photo) => {
  const profileId = photo.user_id || photo.id;
  router.push(`/profile/${profileId}`);
};
</script>
