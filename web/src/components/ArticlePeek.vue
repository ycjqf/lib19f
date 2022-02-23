<script lang="ts" setup>
import { ArticlePreview, ApiGetProfileRequest, ApiGetProfileResponse } from "@typings/api";
import axios from "axios";
import { ref } from "vue";
import moment from "moment";
import "moment/dist/locale/zh-cn";
import { useMessage } from "naive-ui";
moment.locale("zh-cn");

const props = defineProps<{ preview: ArticlePreview }>();
const messager = useMessage();
const profile = ref<ApiGetProfileResponse["profile"]>(undefined);
const loadProfileStatus = ref<"LOADING" | "READY" | "ERROR">("LOADING");

async function init() {
  const user = await axios.post<ApiGetProfileResponse>("/api/get/profile", {
    id: props.preview.userId,
  } as ApiGetProfileRequest);
  if (user.data.code === "OK") {
    profile.value = user.data.profile;
    loadProfileStatus.value = "READY";
  } else {
    messager.error(`${user.data.code}: ${user.data.message}`);
    loadProfileStatus.value = "ERROR";
  }
}

init();
</script>

<template>
  <div
    class="shadow-sm bg-slate-200 hover:shadow-md transition-shadow hover:transition-none ease-out rounded px-4 py-6"
  >
    <router-link :to="{ name: 'article', params: { id: preview.id } }">
      <h4 class="text-2xl text-[#333333]">{{ preview.title }}</h4>
    </router-link>

    <div class="mb-6">
      <p v-if="preview.description !== ''" class="text-[#131419]">{{ preview.description }}</p>
      <p v-else class="text-[#7e7e7e]">无详情</p>
    </div>

    <p class="text-xs">
      <span class="mr-1">
        <span v-if="loadProfileStatus === 'LOADING'">用户加载中</span>
        <span v-if="loadProfileStatus === 'ERROR'">用户加载出错</span>
        <span v-if="loadProfileStatus === 'READY' && profile">
          <span>{{ profile.name }}</span>
        </span>
      </span>

      <span v-if="preview.createdTime === preview.updatedTime"
        >创建于 {{ moment(preview.createdTime).format("llll") }}</span
      >
      <span v-else>更新于 {{ preview.updatedTime }}</span>
    </p>
  </div>
</template>
