import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'wc-github-corners'
import 'viewerjs/dist/viewer.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
