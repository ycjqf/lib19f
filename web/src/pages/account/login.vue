<script lang="ts" setup>
import type { ApiAccountLoginRequest, ApiAccountLoginRespond } from "@typings/api";
import { libraryName, librarySlogan } from "@/config";
import axios from "axios";
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
import {} from "naive-ui/lib/alert/index";
import { useRouter } from "vue-router";

const loginFormRef = ref(null);
const onlyLetterNumberUnderscore = /^\w+$/;
const containSpace = /\s/;
const router = useRouter();

const alertType = ref<AlertProps["type"]>(undefined);
const alertTitle = ref("");
const alertMessage = ref("");
const loginFormData = reactive<ApiAccountLoginRequest>({
  name: "",
  password: "",
});
const loginFormRules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入登录名",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return !containSpace.test(value);
      },
      message: "登录名不能包含空格",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return onlyLetterNumberUnderscore.test(value);
      },
      message: "登录名仅能含数字、字母及下划线",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return value.length >= 4 && value.length <= 12;
      },
      message: "登录名长度位于4到12",
    },
  ],

  password: [
    {
      required: true,
      message: "请输入密码",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return !containSpace.test(value);
      },
      message: "密码不能包含空格",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return onlyLetterNumberUnderscore.test(value);
      },
      message: "密码仅能含数字、字母及下划线",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return value.length >= 8 && value.length <= 16;
      },
      message: "密码长度位于4到12",
    },
  ],
};

function handlePositiveClick() {
  loginFormData.name = "";
  loginFormData.password = "";
}
function handleLogin() {
  // @ts-ignore
  loginFormRef.value.validate((errors) => {
    if (errors) return console.log(errors);
    axios
      .post<ApiAccountLoginRespond>("/api/account/auth", {
        name: loginFormData.name,
        password: loginFormData.password,
      })
      .then((result) => {
        if (result.data.code === 0) {
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
      });
  });
}
</script>

<template>
  <div class="Login">
    <n-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginFormRules"
      :show-require-mark="false"
      class="Login__Form"
      label-align="left"
      label-placement="left"
      label-width="80px"
    >
      <div class="inner">
        <n-collapse-transition :collapsed="!!alertType">
          <n-alert :title="alertTitle" :type="alertType" class="alert-message">
            {{ alertMessage }}
          </n-alert>
        </n-collapse-transition>
        <n-h1 :strong="true" class="title" v-text="libraryName" />
        <n-p class="message" v-text="librarySlogan" />
        <n-form-item class="formItem" first label="登陆名" path="name">
          <n-input v-model:value="loginFormData.name" />
        </n-form-item>

        <n-form-item class="formItem" first label="密码" path="password">
          <n-input
            v-model:value="loginFormData.password"
            :maxlength="16"
            :minlength="8"
            show-password-on="click"
            type="password"
          />
        </n-form-item>
      </div>

      <div class="bottom">
        <div class="buttons">
          <n-popconfirm @positive-click="handlePositiveClick">
            <template #trigger>
              <n-button class="button" round>清除</n-button>
            </template>
            确定重置数据
          </n-popconfirm>
          <n-button class="button" round type="info" @click="handleLogin">登陆</n-button>
        </div>
      </div>
    </n-form>
  </div>
  <div class="LoginBackground"></div>
</template>

<style lang="scss">
.Login {
  position: absolute;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__Form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media screen and (min-width: 769px) {
      // 上右下左
      padding: 80px 50px 60px 50px;
      width: 430px;
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      background-color: #f3f3f3;
    }
    @media screen and (max-width: 768px) {
      width: 100%;
      height: 100vh;
      padding: 80px 52px;
      background-color: #f0f0f0;
    }

    .title,
    .message {
      cursor: pointer;
    }
    .message {
      margin-bottom: 32px;
    }
    .alert-message {
      margin-bottom: 20px;
      .n-alert-body {
        padding-top: 10px;
        padding-bottom: 8px;
      }
    }

    .formItem {
      margin-bottom: 8px;
      cursor: pointer;
    }
    .buttons {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
      .button {
        margin-left: 18px;
      }
    }
  }
}

.LoginBackground {
  width: 100vw;
  height: 100vh;

  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;

  filter: brightness(60%) saturate(70%);
  transition: filter 300ms ease-in;

  @keyframes gradient {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
}
</style>
