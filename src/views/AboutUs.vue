<template>
  <div class="bg-white text-black min-h-screen">
    <header class="border-b-2 border-black py-6">
      <div class="mx-auto">
        <h1 class="text-2xl font-bold">About Us</h1>
      </div>
    </header>

    <main class="mx-auto py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section class="border-r border-black pr-6">
          <h2 class="text-2xl font-bold mb-4">Who We Are</h2>
          <p class="text-lg leading-relaxed">
            ViewGallery is a platform born in 2025, crafted for photographers
            and enthusiasts to share their captured moments. We strip away the
            noise, presenting images in stark black and white to let the art
            speak for itself.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">What We Do</h2>
          <p class="text-lg leading-relaxed">
            We provide a space to upload, view, and connect through photography.
            Our tools are straightforward, our design is unadorned—everything is
            built to keep the focus on the pictures you share.
          </p>
        </section>
      </div>

      <section class="mt-10 border-t-2 border-black pt-8">
        <h2 class="text-2xl font-bold mb-6">Our Principles</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="border border-black p-4">
            <h3 class="text-xl font-semibold">Clarity</h3>
            <p>No clutter, no distractions—just photos.</p>
          </div>
          <div class="border border-black p-4">
            <h3 class="text-xl font-semibold">Community</h3>
            <p>A place for creators to inspire each other.</p>
          </div>
          <div class="border border-black p-4">
            <h3 class="text-xl font-semibold">Contrast</h3>
            <p>Black and white to highlight every detail.</p>
          </div>
          <div class="border border-black p-4">
            <h3 class="text-xl font-semibold">Purpose</h3>
            <p>Built for sharing, not showcasing bells and whistles.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t-2 border-black py-4">
      <div class="mx-auto px-6">
        <p class="text-center text-sm uppercase">
          ViewGallery 2025 - Created for the Art of Photography
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "AboutUsAlternative",
};
</script>

<style scoped>
/* Tailwind handles all styling, no additional CSS needed */
</style>
