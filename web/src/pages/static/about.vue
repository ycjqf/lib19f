<script lang="ts" setup>
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "@/store";
</script>

<template>
  <div class="my-10 mx-auto w-96">
    <h3 class="text-5xl mb-4">{{ LIBRARY_NAME }}</h3>
    <p class="text-base">{{ LIBRARY_SLOGAN }}</p>
  </div>
</template>
