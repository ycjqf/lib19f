import "@/styles/global.scss";
import "vfonts/Lato.css";
import "vfonts/FiraCode.css";
import "@/../dist/tailwind.treeshaked.css";
import { createApp, defineComponent } from "vue";
import router from "@/router";
import { useMessage } from "naive-ui/lib/message";
import { useRouter } from "vue-router";
import { checkTokenAndGetProfile } from "@/store";
import { GlobalThemeOverrides, NConfigProvider } from "naive-ui";
import { zhCN, dateZhCN, NMessageProvider } from "naive-ui";

const routers = useRouter();
const messager = useMessage();
checkTokenAndGetProfile(routers, messager);

const App = defineComponent({
  name: "App",
  render() {
    const themeOverrides: GlobalThemeOverrides = {};

    return (
      <NConfigProvider locale={zhCN} date-locale={dateZhCN} theme-overrides={themeOverrides}>
        <NMessageProvider>
          <router-view></router-view>
        </NMessageProvider>
      </NConfigProvider>
    );
  },
});

createApp(App).use(router).mount("#app");
