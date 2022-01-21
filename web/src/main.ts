import "@/styles/global.scss";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import "@/../dist/tailwind.treeshaked.css";
import { createApp } from "vue";
import App from "@/pages/app.vue";
import router from "@/router";

createApp(App).use(router).mount("#app");
