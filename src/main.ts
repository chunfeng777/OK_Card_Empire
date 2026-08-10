import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './style.css'

const i18n = createI18n({ legacy:false, locale:'zh-CN', messages:{'zh-CN':{}} })
createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')
