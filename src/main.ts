import { createApp } from 'vue';
import App from './App.vue';
import { createEnvironment } from './navigation';

const app = createApp(App);
app.use(createEnvironment());
app.mount('#app');
