<script lang="ts" setup>
const accessToken = localStorage.getItem("access_token");
const refreshToken = localStorage.getItem("refresh_token");
import { useRouter } from "vue-router";
const router = useRouter();
const user = accessToken
  ? JSON.parse(
      decodeURIComponent(
        escape(window.atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
      )
    )
  : undefined;

async function logoff() {
  localStorage.clear();
  console.log("登出");
  window.location.href = "/";
}
</script>

<template>
  {{ accessToken && refreshToken ? `已登陆（${user.name}）` : "未登陆" }}
  <div class="logoff" @click="logoff">登出</div>
</template>
