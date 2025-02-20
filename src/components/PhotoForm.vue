<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          class="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>

      <div>
        <label for="image" class="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        <input
          id="image"
          type="file"
          @change="handleFileChange"
          required
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        />
      </div>

      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="description"
          required
          rows="3"
          class="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black"
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="uploading"
        class="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ uploading ? "Uploading..." : "Submit" }}
      </button>
    </form>

    <p v-if="message" class="mt-4 text-sm text-gray-600">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../supabase";

const emit = defineEmits(["imageUploaded"]);
const name = ref("");
const imageFile = ref("");
const description = ref("");
const uploading = ref(false);
const message = ref("");

const handleFileChange = (event) => {
  imageFile.value = event.target.files[0];
};

const handleSubmit = async () => {
  if (!imageFile.value) {
    message.value = "Please select an image";
    return;
  }

  uploading.value = true;

  // Get the current user
  const {
    data: { user: user },
  } = await supabase.auth.getUser();

  if (!user) {
    message.value = "You must be logged in to submit";
    uploading.value = false;
    return;
  }

  // Upload image to Supabase Storage
  const filePath = `images/${imageFile.value.name}-${Date.now()}`;
  const { data, error } = await supabase.storage
    .from("image_gallery")
    .upload(filePath, imageFile.value);

  if (error) {
    message.value = "Error uploading image";
    uploading.value = false;
    return;
  }

  // Get public URL of uploaded image
  const { data: publicUrlData } = supabase.storage
    .from("image_gallery")
    .getPublicUrl(filePath);

  // Insert post with the current user ID
  const { error: insertError } = await supabase.from("posts").insert([
    {
      name: name.value,
      description: description.value,
      image_url: publicUrlData.publicUrl,
      user_id: user.id,
    },
  ]);

  if (insertError) {
    message.value = "Error saving data";
    await supabase.storage.from("image_gallery").remove(filePath);
  } else {
    message.value = "Data saved successfully!";
    name.value = "";
    description.value = "";
    imageFile.value = null;
  }

  uploading.value = false;

  emit("imageUploaded");
};
</script>
