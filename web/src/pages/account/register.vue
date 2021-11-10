<script lang="ts" setup>
import { libraryName, librarySlogan } from "@/config";
import axios from "axios";
import { ref, reactive } from "vue";
import { NForm, NFormItem, NInput, NH1, NP, NButton, NPopconfirm, FormRules } from "naive-ui";
import { Type } from "naive-ui/lib/button/src/interface";
import { useRouter } from "vue-router";
import { ApiAccountRegisterRespond } from "@typings/api";

const ready = ref(false);
const loginButtonText = ref("注册");
const loginButtonLevel = ref<Type>("info");
const loginFormRef = ref(null);
const onlyLetterNumberUnderscore = /^\w+$/;
const containSpace = /\s/;
const hintText = ref("");
const hintTextColor = ref("grey");
const router = useRouter();
const registerFormData = reactive({
  name: "",
  nickname: "",
  password: "",
  passwordRepeat: "",
});
const registerFormRules: FormRules = {
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
  nickname: [
    {
      required: true,
      message: "请输入显示名",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return !containSpace.test(value);
      },
      message: "显示名不能包含空格",
    },
    {
      trigger: "blur",
      validator: (rule, value) => {
        return value.length >= 4 && value.length <= 12;
      },
      message: "显示名长度位于4到12",
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
  passwordRepeat: [
    {
      required: true,
      message: "请再次输入密码",
    },
    {
      message: "两次密码输入不一致",
      validator: (rule, value) => {
        return value === registerFormData.password;
      },
      trigger: ["blur", "password-input", "input"],
    },
  ],
};

function handlePositiveClick() {
  registerFormData.name = "";
  registerFormData.nickname = "";
  registerFormData.password = "";
  registerFormData.passwordRepeat = "";
}
function handleRegister() {
  // @ts-ignore
  loginFormRef.value.validate(async (errors) => {
    if (!errors) {
      const RegisterRawResult = await axios.post<ApiAccountRegisterRespond>(
        "/api/account/register",
        {
          name: registerFormData.name,
          nickname: registerFormData.nickname,
          password: registerFormData.password,
          passwordRepeat: registerFormData.passwordRepeat,
        }
      );
      if (RegisterRawResult.data.code === 0) {
        ready.value = true;
        loginButtonLevel.value = "success";
        loginButtonText.value = "成功";
        let countdownSeconds = 5;
        setInterval(() => {
          countdownSeconds--;
          hintText.value = `注册成功，${countdownSeconds}秒后返回登陆页面。`;
          if (countdownSeconds === 0) router.push("/login");
        }, 1000);
      } else {
        hintText.value = RegisterRawResult.data.message;
      }
    } else {
      hintText.value = "表单填写有误";
      setTimeout(() => {
        // @ts-ignore
        loginFormRef.value.restoreValidation();
        hintText.value = "";
      }, 5000);
    }
  });
}
</script>

<template>
  <div class="Register">
    <n-form
      ref="loginFormRef"
      :model="registerFormData"
      :rules="registerFormRules"
      :show-require-mark="false"
      class="Register__Form"
      label-align="left"
      label-placement="left"
      label-width="80px"
    >
      <div class="inner">
        <n-h1 :strong="true" v-text="libraryName" />
        <n-p class="Register__Form__Description" v-text="librarySlogan" />
        <n-form-item class="formItem" first label="登陆名" path="name">
          <n-input v-model:value="registerFormData.name" placeholder="登陆使用的名称，不可重复。" />
        </n-form-item>
        <n-form-item class="formItem" first label="显示名" path="nickname">
          <n-input v-model:value="registerFormData.nickname" placeholder="仅供查看的名称" />
        </n-form-item>
        <n-form-item class="formItem" first label="密码" path="password">
          <n-input
            v-model:value="registerFormData.password"
            :maxlength="16"
            :minlength="8"
            placeholder="8到16位的数字字母及下划线的组合"
            show-password-on="click"
            type="password"
          />
        </n-form-item>
        <n-form-item class="formItem" first label="确认密码" path="passwordRepeat">
          <n-input
            v-model:value="registerFormData.passwordRepeat"
            :maxlength="16"
            :minlength="8"
            placeholder="确认密码以防忘记"
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
          <n-button :type="loginButtonLevel" class="button" round @click="handleRegister">
            {{ loginButtonText }}
          </n-button>
        </div>
        <div class="hint-area">
          <n-p :style="{ color: hintTextColor }" class="hint-text">{{ hintText }}</n-p>
        </div>
      </div>
    </n-form>
  </div>
  <div :class="{ 'RegisterBackground--executing': ready }" class="RegisterBackground"></div>
</template>

<style lang="scss">
.Register {
  position: absolute;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &__Form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media screen and (min-width: 769px) {
      // 上右下左
      padding: 80px 50px 60px 50px;
      width: 430px;
      border-radius: 4px;
      margin-right: 15vw;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      background-color: #f3f3f3;
    }
    @media screen and (max-width: 768px) {
      width: 100%;
      height: 100vh;
      padding: 80px 52px;
      background-color: #f0f0f0;
    }

    &__Description {
      margin-bottom: 32px;
    }

    .formItem {
      margin-bottom: 8px;
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
      .button {
        margin-left: 18px;
      }
    }
    .hint-text {
      margin-top: 12px;
      text-align: right;
      font-size: 0.5rem;
      margin-right: 10px;
    }
  }
}

.RegisterBackground {
  width: 100vw;
  height: 100vh;

  background-size: cover;
  background-position: center;
  background-image: url("@/assets/register-background.jpg");

  filter: brightness(50%) saturate(70%);
  transition: filter 300ms ease-in;
  &--executing {
    filter: brightness(90%) saturate(90%);
  }
}
</style>
