<script lang="ts" setup>
import { RouterLink } from "vue-router";
import { LIBRARY_NAME } from "@/store";
import { ref } from "vue";
import { NAutoComplete, useMessage } from "naive-ui";
import { logout, USER_PROFILE } from "@/store";

const messager = useMessage();

const searchString = ref("");
</script>

<template>
  <div class="p-4 text-white bg-[#161b22]">
    <div class="w-4/5 mx-auto flex justify-between items-center">
      <div>
        <div class="flex items-center gap-x-4">
          <router-link class="tw-header-link" to="/articles">文章</router-link>
          <router-link class="tw-header-link" to="/trending">热门</router-link>
          <router-link class="tw-header-link" to="/about"> {{ LIBRARY_NAME }}相关</router-link>
        </div>
      </div>
      <div class="flex items-center">
        <div>
          <n-auto-complete v-model:value="searchString" :placeholder="`搜索${LIBRARY_NAME}`" style="border-radius: 6px"></n-auto-complete>
        </div>
        <div class="flex items-center gap-x-4">
          <router-link v-if="!USER_PROFILE" class="tw-header-link" to="/login"> 登陆 </router-link>
          <router-link v-else class="tw-header-link" @contextmenu.prevent="logout(messager)" :to="`/user/${USER_PROFILE.id}`">
            {{ USER_PROFILE.name }}
          </router-link>
          <router-link v-if="!USER_PROFILE" class="tw-header-link border-[1px] border-white px-2 py-1 rounded-md" to="/register"> 注册 </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
