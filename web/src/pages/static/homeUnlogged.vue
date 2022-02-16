<script lang="ts" setup>
import HeaderBar from "@/components/HeaderBar.vue";
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { ApiGetArticlesResponse, ArticlePreview } from "@typings/api";
import { ref, watch } from "vue";
import { DEFAULT_ARTICLE_PAGE_SIZE } from "@typings/constants";
import axios from "axios";
import ArticlePeek from "@/components/ArticlePeek.vue";
import { useMessage, NPagination } from "naive-ui";

const LOADING_MESSAGE = "正在加载...";
const route = useRoute();
const router = useRouter();
const status = ref<"LOADING" | "ERROR" | "READY">("LOADING");
const message = ref(LOADING_MESSAGE);
const articles = ref<ArticlePreview[]>([]);
const messager = useMessage();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(DEFAULT_ARTICLE_PAGE_SIZE);

watch(route, init);
watch(currentPage, newPage => {
  router.push({ name: "articles", query: { page: newPage, pageSize: pageSize.value } });
});
watch(pageSize, newPageSize => {
  router.push({ name: "articles", query: { page: 1, pageSize: newPageSize } });
});

async function init() {
  status.value = "LOADING";
  message.value = LOADING_MESSAGE;
  articles.value = [];
  total.value = 0;

  // if (typeof route.query.page === "string" && !/^[1-9]\d*$/.test(route.query.page)) {
  //   status.value = "ERROR";
  //   message.value = "页码错误";
  //   return;
  // }
  // if (typeof route.query.pageSize === "string" && !/^[1-9]\d*$/.test(route.query.pageSize)) {
  //   status.value = "ERROR";
  //   message.value = "页面大小错误";
  //   return;
  // }

  if (typeof route.query.page === "string" && /^[1-9]\d*$/.test(route.query.page)) currentPage.value = parseInt(route.query.page);
  if (typeof route.query.pageSize === "string" && /^[1-9]\d*$/.test(route.query.pageSize)) pageSize.value = parseInt(route.query.pageSize);

  const result = await axios.post<ApiGetArticlesResponse>("/api/get/articles", {
    page: currentPage.value,
    pageSize: pageSize.value,
  });
  if (result.data.code === "OK") {
    articles.value = result.data.articles;
    total.value = result.data.total;
    status.value = "READY";
    message.value = "加载成功";
  } else {
    messager.error(`${result.data.code}: ${result.data.message}`);
    status.value = "ERROR";
    message.value = result.data.message;
  }
}

init();
</script>

<template>
  <HeaderBar />
  <div class="w-full bg-slate-900 px-48 py-24 hidden">
    <h1 class="text-7xl font-bolder mb-10 whitespace-nowrap text-white">
      {{ LIBRARY_NAME }}
    </h1>
    <p class="text-gray-300 text-lg">{{ LIBRARY_SLOGAN }}</p>
  </div>

  <div class="container mx-auto">
    <div class="flex flex-col gap-y-10 my-10">
      <ArticlePeek v-for="article in articles" :key="article.id" :preview="article"></ArticlePeek>
    </div>
    <n-pagination
      class="text-center mb-16 w-fit mx-auto"
      v-model:page="currentPage"
      v-model:page-size="pageSize"
      :item-count="total"
      show-size-picker
      :page-sizes="[10, 20, 30, 50, 100]"
    />
  </div>
</template>
