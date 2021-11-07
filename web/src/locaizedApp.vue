<script setup lang="ts">
import { GlobalThemeOverrides, NConfigProvider } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
import App from "@/pages/App.vue";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "gray",
    borderRadius: "6px",
    heightMedium: "32px",
  },
  AutoComplete: {},
};
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <app />
  </n-config-provider>
</template>
