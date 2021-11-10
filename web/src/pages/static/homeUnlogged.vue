<script lang="ts" setup>
import HeaderBar from "@/components/HeaderBar.vue";
import { libraryName, librarySlogan } from "@/config";
</script>

<template>
  <HeaderBar />
  <div class="SplashScreen">
    <h1 class="SplashScreen__Title">{{ libraryName }}</h1>
    <p class="SplashScreen__Description">{{ librarySlogan }}</p>
  </div>
</template>

<style lang="scss" scoped>
.SplashScreen {
  width: 100%;
  padding: 200px 10vw;
  background-color: #304455;
  &__Title {
    font-size: 5rem;
    font-weight: bolder;
    margin-bottom: 40px;
    color: white;
  }
  &__Description {
    font-size: 1.2rem;
    color: #bfbfbf;
  }
}
</style>
