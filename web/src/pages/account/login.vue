<script lang="ts" setup>
import { ref, reactive } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NH1,
  NP,
  NButton,
  NPopconfirm,
  FormRules,
  NAlert,
  AlertProps,
  NCollapseTransition,
} from "naive-ui";
import axios from "axios";
import type { ApiLoginRequest, ApiLoginResponse } from "@typings/api";
import { libraryName, librarySlogan } from "@/config";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_PATTERN,
} from "@typings/constants";

const loginFormRef = ref(null);
const alertType = ref<AlertProps["type"]>(undefined);
const alertTitle = ref("");
const alertMessage = ref("");
const loginFormData = reactive<ApiLoginRequest>({
  name: "",
  password: "",
  email: "",
  capacity: "user",
});
const loginFormRules: FormRules = {
  name: [
    { required: true, message: "请输入登录名" },
    {
      trigger: "blur",
      validator: (_rule, value) =>
        NAME_PATTERN.test(value) &&
        value.length >= NAME_MIN_LENGTH &&
        value.length <= NAME_MAX_LENGTH,
      message: `登录名仅能含数字、字母及下划线，长度位于${NAME_MIN_LENGTH}到${NAME_MAX_LENGTH}之间`,
    },
  ],
  password: [
    { required: true, message: "请输入密码" },
    {
      trigger: "blur",
      validator: (_rule, value) =>
        PASSWORD_PATTERN.test(value) &&
        value.length >= PASSWORD_MIN_LENGTH &&
        value.length <= PASSWORD_MAX_LENGTH,
      message: `密码仅能含数字、字母及下划线，密码长度位于${PASSWORD_MIN_LENGTH}到${PASSWORD_MAX_LENGTH}`,
    },
  ],
};

function handlePositiveClick() {
  loginFormData.name = "";
  loginFormData.password = "";
}
function handleLogin() {
  // @ts-ignore
  loginFormRef.value.validate(errors => {
    if (errors) return console.log(errors);
    axios
      .post<ApiLoginResponse>("/api/account/login", {
        name: loginFormData.name,
        password: loginFormData.password,
      })
      .then(result => {
        if (result.data.code === "OK") {
          if (result.data.accessToken && result.data.refreshToken) {
            localStorage.setItem("access_token", result.data.accessToken);
            localStorage.setItem("refresh_token", result.data.refreshToken);
            window.location.href = "/";
          } else {
            alertType.value = "error";
            alertTitle.value = "服务器出错";
            alertMessage.value = "服务接口有误，未返回令牌，请稍后再试。";
            setTimeout(() => {
              alertType.value = undefined;
              alertTitle.value = "";
              alertMessage.value = "";
            }, 8000);
          }
        } else {
          alertType.value = "error";
          alertTitle.value = "登陆失败";
          alertMessage.value = result.data.message;
          setTimeout(() => {
            alertType.value = undefined;
            alertTitle.value = "";
            alertMessage.value = "";
          }, 8000);
        }
      })
      .catch(error => {
        alertType.value = "error";
        alertTitle.value = "登陆失败";
        alertMessage.value = error.message;
      });
  });
}
</script>

<template>
  <div class="absolute z-10 w-screen h-screen flex items-center justify-center">
    <n-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginFormRules"
      :show-require-mark="false"
      class="flex flex-col justify-between bg-[#f0f0f0] px-10 py-14 w-full h-screen md:rounded md:shadow md:w-96 md:px-8 md:py-4 md:h-auto transition-all duration-150 ease-out"
      label-align="left"
      label-placement="left"
      label-width="80px"
    >
      <div>
        <n-collapse-transition :show="!!alertType">
          <n-alert :title="alertTitle" :type="alertType" class="alert-message mb-5">
            {{ alertMessage }}
          </n-alert>
        </n-collapse-transition>
        <n-h1 :strong="true" class="cursor-pointer" v-text="libraryName" />
        <n-p class="cursor-pointer mb-8" v-text="librarySlogan" />
        <n-form-item class="mb-2 cursor-pointer" first label="登陆名" path="name">
          <n-input v-model:value="loginFormData.name" />
        </n-form-item>

        <n-form-item class="mb-2 cursor-pointer" first label="密码" path="password">
          <n-input
            v-model:value="loginFormData.password"
            :maxlength="16"
            :minlength="8"
            show-password-on="click"
            type="password"
          />
        </n-form-item>
      </div>

      <div>
        <div class="mt-6 flex justify-end">
          <n-popconfirm @positive-click="handlePositiveClick">
            <template #trigger>
              <n-button class="mr-2" round>清除</n-button>
            </template>
            确定重置数据
          </n-popconfirm>
          <n-button round type="info" @click="handleLogin">登陆</n-button>
        </div>
      </div>
    </n-form>
  </div>
  <div class="w-screen h-screen bg-slate-600"></div>
</template>
