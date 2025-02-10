import './styles/main.scss';
import { createApp } from 'vue';
import App from './App.vue';
import { persistedPinia } from './modules/pinia';
import { vuetify } from './modules/vuetify';
import { router } from './router/router';
import axios from 'axios';
import { setupAxiosInterceptors } from './utils/interceptors';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
setupAxiosInterceptors();

const app = createApp(App);

app.use(router);
app.use(persistedPinia);
app.use(vuetify);


app.mount('#app');
