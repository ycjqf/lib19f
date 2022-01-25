<script lang="ts" setup>
import { libraryName } from "@/config";
import { ApiGetProfileRequest, ApiGetProfileResponse } from "@typings/api";
import { useMessage } from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { NAutoComplete } from "naive-ui";

const messager = useMessage();
const router = useRouter();
const searchString = ref("");
const profile = ref<ApiGetProfileResponse["profile"]>(undefined);

async function init() {
  profile.value = undefined;
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (!accessToken || !refreshToken) return;
  try {
    const parsedPayload = JSON.parse(atob(accessToken.split(".")[1]));
    if (!parsedPayload.id) return;
    const result = await axios.post<ApiGetProfileResponse>("/api/get/profile", {
      id: parsedPayload.id,
    });
    if (result.data.code !== "OK") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push({ name: "login" });
      messager.error("登陆ID无效，请重新登陆");
      return;
    }
    profile.value = result.data.profile;
  } catch (e) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push({ name: "login" });
    messager.error("令牌无效，请重新登陆");
    return;
  }
}

async function logoff() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  await init();
  messager.success("已退出登陆");
}

init();
</script>

<template>
  <div class="HeaderBar">
    <div class="HeaderBar__Content">
      <div class="HeaderBar__ContentLeft">
        <div class="HeaderBarContent__Logo"></div>
        <div class="HeaderBarContent__Entries">
          <router-link class="HeaderBar-g__Link" to="/articles">文章</router-link>
          <router-link class="HeaderBar-g__Link" to="/trending">热门</router-link>
          <router-link class="HeaderBar-g__Link" to="/about"> {{ libraryName }}相关</router-link>
        </div>
      </div>
      <div class="HeaderBar__ContentRight">
        <div class="HeaderBarContent__Search">
          <n-auto-complete v-model:value="searchString" :placeholder="`搜索${libraryName}`" style="border-radius: 6px"></n-auto-complete>
        </div>
        <div class="HeaderBarContent__Log">
          <router-link v-if="!profile" class="HeaderBar-g__Link HeaderBarContent__Log__Login" to="/login"> 登陆 </router-link>
          <router-link v-else class="HeaderBar-g__Link HeaderBarContent__Log__Login" @contextmenu.prevent="logoff" :to="`/user/${profile.id}`">{{
            profile.name
          }}</router-link>
          <router-link v-if="!profile" class="HeaderBar-g__Link HeaderBarContent__Log__Register" to="/register"> 注册 </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.HeaderBar {
  padding: 16px;
  color: white;
  background-color: rgb(22, 27, 34);
  &__Content {
    &Right {
      display: flex;
      align-items: center;
    }
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.HeaderBarContent {
  &__Entries {
    color: white;
    .HeaderBar-g__Link {
      margin-right: 1rem;
    }
  }
  &__Log {
    &__Register {
      border: 1px white solid;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .HeaderBar-g__Link {
      margin-left: 1rem;
    }
  }
}
.HeaderBar-g {
  &__Link {
    color: white;
    font-size: 1rem;
    &:hover {
      color: gray;
    }
  }
}
</style>
