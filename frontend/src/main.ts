import { createApp } from "vue";
import App from "./App.vue";
import { createNavigationPlugin } from "./lib/navigation";
import { createCameraPlugin } from "./lib/camera";
import { createWebsocketPlugin } from "./lib/web-socket";
import Loop from "./pages/loop/loop.vue";

const app = createApp(App);
app.use(createNavigationPlugin({ initial: { component: Loop, props: {} } }));
app.use(createCameraPlugin());
app.use(createWebsocketPlugin());
app.mount("#app");
