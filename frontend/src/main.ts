import { createApp } from 'vue';
import App from './App.vue';
import { createNavigationPlugin } from './lib/navigation';
import { createCameraPlugin } from './lib/camera';
import { createWebsocketPlugin } from './lib/web-socket';

const app = createApp(App);
app.use(createNavigationPlugin());
app.use(createCameraPlugin());
app.use(createWebsocketPlugin());
app.mount('#app');
