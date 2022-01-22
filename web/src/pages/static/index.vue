<script lang="ts" setup>
import { useMessage, NButton } from "naive-ui";

const accessToken = localStorage.getItem("access_token");
const refreshToken = localStorage.getItem("refresh_token");
const user = accessToken ? JSON.parse(decodeURIComponent(window.atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))) : undefined;
const message = useMessage();

async function logoff() {
  localStorage.clear();
  message.info("已注销");
  window.location.href = "/";
}
</script>

<template>
  <div class="w-screen">
    <span class="text-2xl">{{ accessToken && refreshToken ? `已登陆（${user.id}）` : "未登陆" }}</span>
    <n-button class="text-base" @click="logoff"> 登出 </n-button>
  </div>
</template>
