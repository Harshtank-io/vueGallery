<template>
  <div class="text-white flex flex-col md:flex-row items-center gap-6">
    <!-- Profile Image -->
    <div class="w-96 h-96 md:w-40 md:h-40 flex-shrink-0 bg-black p-1">
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";

const user = ref({
  id: "", // Add an id field to store the user's ID
  name: "Chris Coyier",
  email: "chris@example.com",
  bio: "I'm a web designer and developer. I'm the co-founder of CodePen and have written books on CSS and SVG.",
  user_profile: "", // Placeholder for profile picture
});

const defaultProfilePicture =
  "https://img.freepik.com/free-photo/bright-neon-colors-shining-wild-chameleon_23-2151682804.jpg";

onMounted(async () => {
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  if (userData) {
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

console.log(user);

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
