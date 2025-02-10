import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

export function setupAxiosInterceptors() {
  axios.interceptors.request.use((config) => {
    const authStore = useAuthStore();

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}
