<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black/15 backdrop-blur-sm bg-opacity-50 z-10"
  >
    <div class="bg-white p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Edit Profile</h2>

      <form @submit.prevent="updateProfile">
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">Name</label>
          <input
            v-model="localUser.user_name"
            type="text"
            class="w-full p-2 border"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">Email</label>
          <input
            v-model="localUser.email"
            type="email"
            class="w-full p-2 border"
            required
          />
        </div>

        <!-- Profile Picture Upload -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1"
            >Profile Picture</label
          >
          <div class="flex items-center gap-4">
            <img
              :src="
                previewImage || localUser.user_profile || defaultProfilePicture
              "
              class="w-16 h-16 rounded-full object-cover"
            />

            <!-- Show this for all devices -->
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="border p-2 w-full"
            />

            <!-- Conditionally show this on mobile (Android) devices -->
            <input
              v-if="isMobile"
              type="file"
              @change="handleFileUpload"
              class="border p-2 w-full"
              accept="image/*"
              capture="camera"
            />
          </div>
        </div>

        <!-- Bio -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-1">Bio</label>
          <textarea
            v-model="localUser.bio"
            class="w-full p-2 border"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex justify-between mt-4">
          <button
            type="button"
            @click="closeModal"
            class="hover:bg-black hover:text-white text-black px-4 py-2 border"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-black text-white px-4 py-2 hover:text-black hover:bg-white border"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import { supabase } from "../supabase";

const props = defineProps({
  user: Object,
  isOpen: Boolean,
});

const emit = defineEmits(["close", "updateUser"]);

const localUser = ref({ ...props.user });
const file = ref(null);
const previewImage = ref(null);

const defaultProfilePicture =
  "https://img.freepik.com/free-photo/bright-neon-colors-shining-wild-chameleon_23-2151682804.jpg";

watch(
  () => props.user,
  (newVal) => {
    localUser.value = { ...newVal };
  }
);

// Detect if the user is on a mobile device (Android)
const isMobile = computed(() => {
  return /Android/i.test(navigator.userAgent);
});

const handleFileUpload = (event) => {
  file.value = event.target.files[0];

  if (file.value) {
    previewImage.value = URL.createObjectURL(file.value);
  }
};

const updateProfile = async () => {
  let profileImageUrl = localUser.value.user_profile;

  if (file.value) {
    const fileName = `${localUser.value.id}_${Date.now()}.${file.value.name
      .split(".")
      .pop()}`;
    const { data, error } = await supabase.storage
      .from("user_profiles")
      .upload(fileName, file.value, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("File upload failed:", error);
      return;
    }

    profileImageUrl = `${
      supabase.storage.from("user_profiles").getPublicUrl(fileName).data
        .publicUrl
    }`;
  }

  const { error } = await supabase
    .from("users")
    .update({
      user_name: localUser.value.user_name,
      email: localUser.value.email,
      bio: localUser.value.bio,
      user_profile: profileImageUrl,
    })
    .eq("id", localUser.value.id);

  if (error) {
    console.error("Update failed:", error);
  } else {
    emit("updateUser", { ...localUser.value, user_profile: profileImageUrl });
    emit("close");
  }
};

const closeModal = () => {
  emit("close");
};
</script>
