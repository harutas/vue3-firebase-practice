import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./index.css";

const pinia = createPinia();

createApp(App).use(pinia).mount("#app");
