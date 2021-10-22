<script lang="ts" setup>
import { libraryName, librarySlogan } from "@/config";
</script>

<template>
  <div class="LibraryInfo">
    <h3 class="LibraryInfo__Name">{{ libraryName }}</h3>
    <p class="LibraryInfo__Slogan">{{ librarySlogan }}</p>
  </div>
</template>

<style lang="scss">
.LibraryInfo {
  width: 640px;
  margin: 40px auto;
  &__Name {
    font-size: 3rem;
  }
  &__Slogan {
    font-size: 1rem;
  }
}
</style>
