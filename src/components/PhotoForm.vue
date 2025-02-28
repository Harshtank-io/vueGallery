<template>
  <div class="container mx-auto mt-4 sm:mt-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-full sm:max-w-md mx-auto bg-white p-4 sm:p-6">
      <div class="mb-4">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex flex-col sm:flex-row gap-2 sm:gap-8">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="currentTab = tab.name"
              :class="[
                currentTab === tab.name
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 sm:py-4 px-1 border-b-2 font-medium text-sm w-full sm:w-auto',
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
              :style="combinedStyle"
              alt="Preview"
              class="w-full h-auto object-contain max-h-64 sm:max-h-96"
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
              class="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm sm:text-base py-2"
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
              class="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm sm:text-base"
            ></textarea>
            <p
              v-if="aiSuggestedDescription"
              class="mt-2 text-xs sm:text-sm text-gray-600"
            >
              AI Suggestion: "{{ aiSuggestedDescription }}"
              <button
                @click="applyAISuggestedDescription"
                type="button"
                class="ml-2 text-xs sm:text-sm text-blue-600 hover:underline"
              >
                Apply
              </button>
            </p>
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
              class="mt-1 block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>
        </div>

        <!-- Filters & Effects Tab -->
        <div v-if="currentTab === 'preview' && imagePreview">
          <div class="space-y-4">
            <div class="mt-4">
              <img
                :src="imagePreview"
                :style="combinedStyle"
                alt="Preview"
                class="w-full h-auto object-contain max-h-64 sm:max-h-96"
              />
            </div>

            <div v-if="aiSuggestedFilter" class="mb-4">
              <p class="text-xs sm:text-sm text-gray-600">
                AI Suggested Filter: {{ aiSuggestedFilter.label }}
                <button
                  @click="applyFilterPreset(aiSuggestedFilter.name)"
                  type="button"
                  class="ml-2 text-xs sm:text-sm text-blue-600 hover:underline"
                >
                  Apply
                </button>
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in filterPresets"
                :key="preset.name"
                @click="applyFilterPreset(preset.name)"
                type="button"
                class="py-1 px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                {{ preset.label }}
              </button>
              <button
                @click="randomizeFilters"
                type="button"
                class="py-1 px-2 sm:px-3 text-xs sm:text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                Surprise Me!
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-xs sm:text-sm font-medium text-gray-700"
                  >Brightness</label
                >
                <input
                  v-model="filters.brightness"
                  type="range"
                  min="0"
                  max="200"
                  class="w-full accent-black"
                />
              </div>
              <div>
                <label
                  class="block text-xs sm:text-sm font-medium text-gray-700"
                  >Contrast</label
                >
                <input
                  v-model="filters.contrast"
                  type="range"
                  min="0"
                  max="200"
                  class="w-full accent-black"
                />
              </div>
              <div>
                <label
                  class="block text-xs sm:text-sm font-medium text-gray-700"
                  >Saturation</label
                >
                <input
                  v-model="filters.saturation"
                  type="range"
                  min="0"
                  max="200"
                  class="w-full accent-black"
                />
              </div>
              <div>
                <label
                  class="block text-xs sm:text-sm font-medium text-gray-700"
                  >Hue</label
                >
                <input
                  v-model="filters.hue"
                  type="range"
                  min="0"
                  max="360"
                  class="w-full accent-black"
                />
              </div>
              <div>
                <label
                  class="block text-xs sm:text-sm font-medium text-gray-700"
                  >Sepia</label
                >
                <input
                  v-model="filters.sepia"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full accent-black"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            :disabled="uploading"
            class="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ uploading ? "Uploading..." : "Submit" }}
          </button>
        </div>
      </form>

      <p v-if="message" class="mt-4 text-xs sm:text-sm text-gray-600">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
// The script section remains unchanged as it handles logic rather than styling
import { ref, computed } from "vue";
import { supabase } from "../supabase";

const emit = defineEmits(["imageUploaded"]);
const name = ref("");
const imageFile = ref(null);
const description = ref("");
const uploading = ref(false);
const message = ref("");
const imagePreview = ref(null);
const currentTab = ref("basic");
const aiSuggestedFilter = ref(null);
const aiSuggestedDescription = ref("");

const filters = ref({
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  sepia: 0,
});

const tabs = [
  { name: "basic", label: "Basic Info" },
  { name: "preview", label: "Filters & Effects" },
];

const filterPresets = [
  { name: "normal", label: "Normal" },
  { name: "vintage", label: "Vintage" },
  { name: "highContrast", label: "High Contrast" },
  { name: "vibrant", label: "Vibrant" },
  { name: "dreamy", label: "Dreamy" },
  { name: "mono", label: "Monochrome" },
];

// Rest of the script logic remains the same...
const applyFilterPreset = (preset) => {
  filters.value = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    sepia: 0,
  };
  switch (preset) {
    case "vintage":
      filters.value.brightness = 90;
      filters.value.contrast = 120;
      filters.value.saturation = 80;
      filters.value.sepia = 50;
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
    case "dreamy":
      filters.value.brightness = 120;
      filters.value.contrast = 80;
      filters.value.saturation = 90;
      break;
    case "mono":
      filters.value.saturation = 0;
      filters.value.contrast = 120;
      break;
  }
};

const randomizeFilters = () => {
  filters.value = {
    brightness: Math.floor(Math.random() * 150) + 50,
    contrast: Math.floor(Math.random() * 150) + 50,
    saturation: Math.floor(Math.random() * 150) + 50,
    hue: Math.floor(Math.random() * 360),
    sepia: Math.floor(Math.random() * 80),
  };
};

const filterStyle = computed(() => ({
  filter: `
    brightness(${filters.value.brightness}%) 
    contrast(${filters.value.contrast}%) 
    saturate(${filters.value.saturation}%) 
    hue-rotate(${filters.value.hue}deg) 
    sepia(${filters.value.sepia}%)
  `,
}));

const combinedStyle = computed(() => ({
  ...filterStyle.value,
  objectFit: "contain",
}));

const analyzeImageWithAI = async (file) => {
  const randomPreset =
    filterPresets[Math.floor(Math.random() * filterPresets.length)];
  const mockDescriptions = [
    "Chasing sunsets",
    "A moment of serenity",
    "City vibes",
    "Nature’s beauty",
    "Good times with great friends",
  ];
  const randomDescription =
    mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];

  aiSuggestedFilter.value = randomPreset;
  aiSuggestedDescription.value = randomDescription;
};

const applyAISuggestedDescription = () => {
  description.value = aiSuggestedDescription.value;
  aiSuggestedDescription.value = "";
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
      analyzeImageWithAI(file);
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
  const { error } = await supabase.storage
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
    message.value = "Image uploaded successfully!";
    name.value = "";
    description.value = "";
    imageFile.value = null;
    imagePreview.value = null;
    filters.value = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      sepia: 0,
    };
    aiSuggestedFilter.value = null;
    aiSuggestedDescription.value = "";
    currentTab.value = "basic";
  }

  uploading.value = false;
  emit("imageUploaded");
};
</script>
