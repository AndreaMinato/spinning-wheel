import { createApp } from "vue";
import App from "./App.vue";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("need refresh");
  },
  onOfflineReady() {
    console.log("offline ready");
  },
});

createApp(App).mount("#app");
