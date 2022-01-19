<script lang="ts" setup>
import { libraryName, librarySlogan } from "@/config";
</script>

<template>
  <div class="my-10 mx-auto w-96">
    <h3 class="text-5xl mb-4">{{ libraryName }}</h3>
    <p class="text-base">{{ librarySlogan }}</p>
  </div>
</template>
