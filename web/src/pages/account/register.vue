<script lang="ts" setup>
import { libraryName, librarySlogan } from "@/store";
import axios, { AxiosResponse } from "axios";
import { ref, reactive } from "vue";
import { NForm, NFormItem, NInput, NH1, NP, NButton, NPopconfirm, FormRules } from "naive-ui";
import { Type } from "naive-ui/lib/button/src/interface";
import { useRouter } from "vue-router";
import { default as backgroundImageURL } from "@/assets/register-background.jpg";
import { ApiRegisterRequest, ApiRegisterResponse } from "@typings/api";
import { NAME_PATTERN, NAME_MIN_LENGTH, NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from "@typings/constants";

const ready = ref(false);
const loginButtonText = ref("注册");
const loginButtonLevel = ref<Type>("info");
const loginFormRef = ref(null);
const hintText = ref("");
const hintTextColor = ref("grey");
const router = useRouter();
const registerFormData = reactive<ApiRegisterRequest>({
  name: "",
  email: "",
  password: "",
  passwordRepeat: "",
  capacity: "user",
});
const registerFormRules: FormRules = {
  name: [
    { required: true, message: "请输入登录名" },
    {
      trigger: "blur",
      validator: (_rule, value) => NAME_PATTERN.test(value) && value.length >= NAME_MIN_LENGTH && value.length <= NAME_MAX_LENGTH,
      message: `${NAME_MIN_LENGTH}到${NAME_MAX_LENGTH}数字字母及下划线`,
    },
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱",
      type: "email",
    },
    {
      trigger: "blur",
      message: "请输入正确的邮箱地址",
      type: "email",
    },
  ],
  password: [
    { required: true, message: "请输入密码" },
    {
      trigger: "blur",
      validator: (_rule, value) => PASSWORD_PATTERN.test(value) && value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH,
      message: `${PASSWORD_MIN_LENGTH}到${PASSWORD_MAX_LENGTH}位数字字母及下划线`,
    },
  ],
  passwordRepeat: [
    {
      required: true,
      message: "请再次输入密码",
    },
    {
      message: "两次密码输入不一致",
      validator: (rule, value) => value === registerFormData.password,
      trigger: ["blur", "password-input", "input"],
    },
  ],
};

async function handleRegister() {
  type ValidateError = { field: string; fieldValue: string; message: string };
  // @ts-ignore
  const validateErrors = (await loginFormRef.value.validate()) as Array<ValidateError>;
  if (validateErrors && validateErrors.length > 0) return hintAndRestore("请检查表单项", 5000);

  const loginPromise = axios.post<ApiRegisterResponse>("/api/account/register", registerFormData);
  const onResolve = (result: AxiosResponse<ApiRegisterResponse, any>) => {
    if (result.data.code !== "OK") return hintAndRestore("登陆失败", 8000);
    ready.value = true;
    loginButtonLevel.value = "success";
    loginButtonText.value = "成功";
    let countdownSeconds = 5;
    setInterval(() => {
      countdownSeconds--;
      hintText.value = `注册成功，${countdownSeconds}秒后返回登陆页面。`;
      if (countdownSeconds === 0) router.push("/login");
    }, 1000);
  };

  loginPromise.then(onResolve).catch(error => {
    hintAndRestore(error.message, 5000);
  });
}

function restoreForm() {
  registerFormData.name = "";
  registerFormData.email = "";
  registerFormData.password = "";
  registerFormData.passwordRepeat = "";
}

function hintAndRestore(message: string, duration: number) {
  hintText.value = message;
  setTimeout(() => {
    // @ts-ignore
    loginFormRef.value.restoreValidation();
    hintText.value = "";
  }, duration);
}
</script>

<template>
  <div class="absolute z-10 w-screen h-screen flex items-center justify-end md:pr-20 xl:pr-10">
    <n-form
      ref="loginFormRef"
      :model="registerFormData"
      :rules="registerFormRules"
      :show-require-mark="false"
      class="
        flex flex-col
        justify-between
        bg-[#f0f0f0]
        px-10
        py-14
        w-full
        h-screen
        md:rounded md:shadow md:w-96 md:px-8 md:py-4 md:h-auto
        transition-all
        duration-150
        ease-out
      "
      label-align="left"
      label-placement="left"
      label-width="80px"
    >
      <div>
        <n-h1 :strong="true" v-text="libraryName" />
        <n-p class="mb-8" v-text="librarySlogan" />

        <n-form-item class="mb-2" first label="登陆名" path="name">
          <n-input v-model:value="registerFormData.name" placeholder="登陆名称" />
        </n-form-item>
        <n-form-item class="mb-2" first label="显示名" path="email">
          <n-input v-model:value="registerFormData.email" placeholder="邮箱，用于通知重要信息" />
        </n-form-item>
        <n-form-item class="mb-2" first label="密码" path="password">
          <n-input v-model:value="registerFormData.password" placeholder="请输入密码" show-password-on="click" type="password" />
        </n-form-item>
        <n-form-item class="mb-2" first label="确认密码" path="passwordRepeat">
          <n-input v-model:value="registerFormData.passwordRepeat" placeholder="确认密码" show-password-on="click" type="password" />
        </n-form-item>
      </div>

      <div>
        <div class="flex justify-end">
          <n-popconfirm @positive-click="restoreForm">
            <template #trigger>
              <n-button class="mr-4" round>清除</n-button>
            </template>
            确定重置数据
          </n-popconfirm>
          <n-button :type="loginButtonLevel" class="button" round @click="handleRegister">
            {{ loginButtonText }}
          </n-button>
        </div>
        <div class="hint-area">
          <n-p :style="{ color: hintTextColor }" class="mt-4 block text-right text-xs mr-2">
            {{ hintText }}
          </n-p>
        </div>
      </div>
    </n-form>
  </div>
  <div
    :class="{ 'brightness-90 saturate-100': ready }"
    :style="`background-image: url('${backgroundImageURL}')`"
    class="w-full h-full bg-cover bg-center filter brightness-50 saturate-50 transition-all duration-300 ease-out"
  ></div>
</template>
