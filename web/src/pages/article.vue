<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const articleId = ref<number | undefined>(undefined);

if (typeof route.params.id === "string" && /^[1-9]\d*$/.test(route.params.id)) articleId.value = parseInt(route.params.id);
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <span class="text-9xl font-mono font-extrabold">{{ articleId ? articleId : "无" }}</span>
  </div>
</template>
