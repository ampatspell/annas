import { createApp } from "vue";
import App from "./App.vue";
import { createNavigationPlugin } from "./lib/navigation";
import { createCameraPlugin } from "./lib/camera";

const app = createApp(App);
app.use(createNavigationPlugin());
app.use(createCameraPlugin());
app.mount("#app");
