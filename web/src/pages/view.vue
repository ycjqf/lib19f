<script lang="ts" setup>
import { checkTokenAndGetProfile } from "@/store";
import { useMessage } from "naive-ui/lib/message";
import { useRouter } from "vue-router";
const router = useRouter();
const messager = useMessage();
checkTokenAndGetProfile(router, messager);
</script>

<template><router-view></router-view></template>
