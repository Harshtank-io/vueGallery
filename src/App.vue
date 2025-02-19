<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { useRoute } from "vue-router";
import { shallowRef, ref, watch } from "vue";

const route = useRoute();

const layout = shallowRef(route.meta.layout);

watch(route, (newRoute) => {
  layout.value = newRoute.meta.layout;
});
</script>
