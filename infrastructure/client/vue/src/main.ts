import { createApp } from 'vue';
import App from './App.vue';
import { vuetify } from './modules/vuetify';
import { persistedPinia } from './modules/pinia';
import { router } from './router/router';

const app = createApp(App);

app.use(router)
app.use(persistedPinia)
app.use(vuetify);

app.mount('#app')
