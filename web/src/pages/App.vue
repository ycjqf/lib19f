<script setup lang="ts">
import { GlobalThemeOverrides, NConfigProvider } from "naive-ui";
import { zhCN, dateZhCN, NMessageProvider } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {};
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>
