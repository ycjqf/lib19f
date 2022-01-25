<script lang="ts" setup>
import { libraryName } from "@/config";
import { ref } from "vue";
import { NAutoComplete, useMessage } from "naive-ui";
import { logout, USER_PROFILE } from "@/store";
const messager = useMessage();
const searchString = ref("");
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
          <router-link v-if="!USER_PROFILE" class="HeaderBar-g__Link HeaderBarContent__Log__Login" to="/login"> 登陆 </router-link>
          <router-link v-else class="HeaderBar-g__Link HeaderBarContent__Log__Login" @contextmenu.prevent="logout(messager)" :to="`/user/${USER_PROFILE.id}`">{{
            USER_PROFILE.name
          }}</router-link>
          <router-link v-if="!USER_PROFILE" class="HeaderBar-g__Link HeaderBarContent__Log__Register" to="/register"> 注册 </router-link>
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
