<script setup lang="ts">
import { NConfigProvider } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
import App from "@/pages/App.vue";
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <app />
  </n-config-provider>
</template>
