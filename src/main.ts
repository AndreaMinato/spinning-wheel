import { createApp } from "vue";
import App from "./App.vue";

import { registerSW } from "virtual:pwa-register/vue";

registerSW({ immediate: true });

createApp(App).mount("#app");
