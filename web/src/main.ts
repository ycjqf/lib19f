import "@/styles/global.scss";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";

import { createApp } from "vue";

import App from "@/locaizedApp.vue";
import router from "@/router";

createApp(App).use(router).mount("#app");
