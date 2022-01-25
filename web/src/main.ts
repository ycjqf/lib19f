import "@/styles/global.scss";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import "@/../dist/tailwind.treeshaked.css";
import { createApp } from "vue";
import App from "@/pages/app.vue";
import router from "@/router";

import { useMessage } from "naive-ui/lib/message";
import { useRouter } from "vue-router";
import { checkTokenAndGetProfile } from "@/store";
const routers = useRouter();
const messager = useMessage();
checkTokenAndGetProfile(routers, messager);

createApp(App).use(router).mount("#app");
