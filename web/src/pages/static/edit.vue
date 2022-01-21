<script lang="ts" setup>
import { Editor, rootCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { VueEditor, useEditor } from "@milkdown/vue";
import { commonmark } from "@milkdown/preset-commonmark";
import { history } from "@milkdown/plugin-history";
import { ref } from "vue";
import { ApiAddArticleRequest, ApiAddArticleResponse } from "@typings/api";
import { NIcon, NButton, NPopconfirm, useMessage, c } from "naive-ui";
import { TextEditStyle24Regular } from "@vicons/fluent";
import { credentialEmpty } from "@/utils/request";
import { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_ARTICLE_CHARS } from "@typings/constants";
import { AxiosResponse } from "axios";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { postWithCredential } from "@/utils/request";

const message = useMessage();
const input = ref<ApiAddArticleRequest>({
  title: "",
  description: "",
  body: "",
});

const editor = useEditor(root =>
  Editor.make()
    .config(ctx => {
      ctx.set(rootCtx, root);
      ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
        input.value.body = markdown;
      });
    })
    .use(nord)
    .use(history)
    .use(commonmark)
    .use(listener)
);

function onSubmit() {
  message.destroyAll();
  if (credentialEmpty()) return message.error("请先登录");
  if (input.value.title.trim().length < MIN_TITLE_LENGTH || input.value.title.trim().length > MAX_TITLE_LENGTH)
    return message.error(`标题长度${MIN_TITLE_LENGTH}到${MAX_TITLE_LENGTH}`);
  if (input.value.description.trim().length > MAX_DESCRIPTION_LENGTH) return message.error(`描述长度不能超过${MAX_DESCRIPTION_LENGTH}`);
  if (input.value.body.trim().length === 0) return message.error("内容不能为空");
  if (input.value.body.trim().length > MAX_ARTICLE_CHARS) return message.error(`内容不能超过${MAX_ARTICLE_CHARS}字符"`);

  const postPromise = postWithCredential<ApiAddArticleRequest, ApiAddArticleResponse>("/api/add/article", input.value);
  const onResolve = (res: AxiosResponse<ApiAddArticleResponse>) => {
    if (res.data.code === "OK") {
      message.success("发布成功");
      resetForm();
    } else message.error(`${res.data.code} ${res.data.message}`);
  };
  postPromise.then(onResolve).catch(() => {
    message.error("请求失败");
  });
}

function resetForm() {
  message.destroyAll();
  input.value.title = "";
  input.value.description = "";
  input.value.body = "";
  message.success("表单已重置");
}
</script>

<template>
  <div class="bg-[#2e3440] h-screen w-screen">
    <div class="container mx-auto flex flex-col w-full h-full pb-8 overflow-hidden">
      <div class="input-line flex flex-nowrap items-center mt-8 mb-4 flex-row-reverse">
        <input
          type="text"
          class="input-line-input border-none bg-transparent text-slate-100 font-semibold flex-1 text-4xl focus:outline-none truncate"
          placeholder="请输入文章标题"
          maxlength="20"
          minlength="4"
          v-model="input.title"
        />
        <text-edit-style24-regular class="input-line-icon transition-colors ease-out duration-300 w-8 h-8 mr-4"></text-edit-style24-regular>
      </div>
      <div class="input-line flex flex-nowrap items-center mb-8 flex-row-reverse">
        <input
          type="text"
          class="input-line-input bg-transparent border-none text-slate-200 flex-1 text-xl focus:outline-none truncate"
          placeholder="文章介绍"
          maxlength="140"
          v-model="input.description"
        />
        <text-edit-style24-regular class="input-line-icon transition-colors ease-out duration-300 w-8 h-8 mr-4"></text-edit-style24-regular>
      </div>
      <div class="flex-1 pb-4 overflow-scroll">
        <vue-editor :editor="editor"></vue-editor>
      </div>

      <div class="w-full flex flex-nowrap justify-end pt-8 gap-x-4 px-2">
        <n-button round type="primary" :focusable="false" @click="onSubmit">
          <template #icon>
            <n-icon>
              <text-edit-style24-regular />
            </n-icon>
          </template>
          上传
        </n-button>
        <n-popconfirm :show-icon="false" @positive-click="resetForm">
          <template #trigger>
            <n-button ghost round color="gray" :focusable="false">
              <template #icon>
                <n-icon>
                  <text-edit-style24-regular />
                </n-icon>
              </template>
              重置
            </n-button>
          </template>
          确认重置
        </n-popconfirm>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-line {
  .input-line-input + .input-line-icon {
    color: gray;
  }
  .input-line-input:focus + .input-line-icon {
    color: goldenrod;
  }
}

:deep(.milkdown) {
  box-shadow: none;
}
</style>
