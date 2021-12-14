<script lang="ts" setup>
import HeaderBar from "@/components/HeaderBar.vue";
import { libraryName, librarySlogan } from "@/config";
</script>

<template>
  <HeaderBar />
  <div class="w-full bg-slate-900 px-48 py-24">
    <h1 class="text-7xl font-bolder mb-10 whitespace-nowrap text-white">
      {{ libraryName }}
    </h1>
    <p class="text-gray-300 text-lg">{{ librarySlogan }}</p>
  </div>
</template>
