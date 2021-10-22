<script lang="ts" setup>
const accessToken = localStorage.getItem("access_token");
const refreshToken = localStorage.getItem("refresh_token");
const user = accessToken
  ? JSON.parse(
      decodeURIComponent(
        escape(window.atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
      )
    )
  : undefined;
</script>

<template>{{ accessToken && refreshToken ? `已登陆（${user.name}）` : "未登陆" }}</template>
