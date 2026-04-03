import { createApp } from 'vue'
import App from './App.vue'
import { createNavigationPlugin } from './lib/navigation'

const app = createApp(App)
app.use(createNavigationPlugin())
app.mount('#app')
