<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white">
    <div class="mb-4">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="currentTab = tab.name"
            :class="[
              currentTab === tab.name
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Basic Info Tab -->
      <div v-if="currentTab === 'basic'">
        <div class="mt-4">
          <img
            :src="imagePreview"
            :style="filterStyle"
            alt="Preview"
            class="max-w-full h-auto"
          />
        </div>
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
      </div>

      <!-- Tags Tab -->
      <!-- <div v-if="currentTab === 'tags'">
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            placeholder="e.g., nature, art, photography"
            class="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        </div>
      </div> -->

      <!-- Combined Preview & Filter Tab -->
      <div v-if="currentTab === 'preview' && imagePreview">
        <div class="space-y-4">
          <!-- Preview Image with Live Filtering -->
          <div class="mt-4">
            <img
              :src="imagePreview"
              :style="filterStyle"
              alt="Preview"
              class="max-w-full h-auto"
            />
          </div>

          <!-- Pre-defined Filter Buttons -->
          <div class="flex space-x-2">
            <button
              @click="applyFilterPreset('normal')"
              type="button"
              class="py-1 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Normal
            </button>
            <button
              @click="applyFilterPreset('vintage')"
              type="button"
              class="py-1 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Vintage
            </button>
            <button
              @click="applyFilterPreset('highContrast')"
              type="button"
              class="py-1 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              High Contrast
            </button>
            <button
              @click="applyFilterPreset('vibrant')"
              type="button"
              class="py-1 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Vibrant
            </button>
          </div>

          <!-- Filter Controls -->
          <div>
            <label
              for="brightness"
              class="block text-sm font-medium text-gray-700"
            >
              Brightness
            </label>
            <input
              id="brightness"
              v-model="filters.brightness"
              type="range"
              min="0"
              max="200"
              class="w-full accent-black"
            />
          </div>
          <div>
            <label
              for="contrast"
              class="block text-sm font-medium text-gray-700"
            >
              Contrast
            </label>
            <input
              id="contrast"
              v-model="filters.contrast"
              type="range"
              min="0"
              max="200"
              class="w-full accent-black"
            />
          </div>
          <div>
            <label
              for="saturation"
              class="block text-sm font-medium text-gray-700"
            >
              Saturation
            </label>
            <input
              id="saturation"
              v-model="filters.saturation"
              type="range"
              min="0"
              max="200"
              class="w-full accent-black"
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="uploading"
          class="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ uploading ? "Uploading..." : "Submit" }}
        </button>
      </div>
    </form>

    <p v-if="message" class="mt-4 text-sm text-gray-600">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { supabase } from "../supabase";

const emit = defineEmits(["imageUploaded"]);
const name = ref("");
const imageFile = ref(null);
const description = ref("");
const uploading = ref(false);
const message = ref("");
// const tagsInput = ref("");
const imagePreview = ref(null);
const currentTab = ref("basic");

const filters = ref({
  brightness: 100,
  contrast: 100,
  saturation: 100,
});

const applyFilterPreset = (preset) => {
  switch (preset) {
    case "normal":
      filters.value.brightness = 100;
      filters.value.contrast = 100;
      filters.value.saturation = 100;
      break;
    case "vintage":
      filters.value.brightness = 90;
      filters.value.contrast = 120;
      filters.value.saturation = 80;
      break;
    case "highContrast":
      filters.value.brightness = 110;
      filters.value.contrast = 150;
      filters.value.saturation = 100;
      break;
    case "vibrant":
      filters.value.brightness = 110;
      filters.value.contrast = 110;
      filters.value.saturation = 150;
      break;
  }
};

const tabs = [
  { name: "basic", label: "Basic Info" },
  // { name: "tags", label: "Tags" },
  { name: "preview", label: "Filters" },
];

const filterStyle = computed(() => ({
  filter: `brightness(${filters.value.brightness}%) contrast(${filters.value.contrast}%) saturate(${filters.value.saturation}%)`,
}));

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  if (!imageFile.value) {
    message.value = "Please select an image";
    return;
  }

  uploading.value = true;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    message.value = "You must be logged in to submit";
    uploading.value = false;
    return;
  }

  const filePath = `images/${imageFile.value.name}-${Date.now()}`;
  const { data, error } = await supabase.storage
    .from("image_gallery")
    .upload(filePath, imageFile.value);

  if (error) {
    message.value = "Error uploading image";
    uploading.value = false;
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("image_gallery")
    .getPublicUrl(filePath);

  // const tags = tagsInput.value
  //   .split(",")
  //   .map((tag) => tag.trim())
  //   .filter((tag) => tag.length > 0);

  const { error: insertError } = await supabase.from("posts").insert([
    {
      name: name.value,
      description: description.value,
      image_url: publicUrlData.publicUrl,
      user_id: user.id,
      filter: filters.value,
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
    // tagsInput.value = "";
    imagePreview.value = null;
    filters.value = { brightness: 0, contrast: 0, saturation: 0 };
    currentTab.value = "basic";
  }

  uploading.value = false;
  emit("imageUploaded");
};
</script>
