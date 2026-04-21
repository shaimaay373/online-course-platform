import axios from 'axios';

function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE?.trim();
  if (fromEnv) {
    const base = fromEnv.replace(/\/+$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  }
  if (import.meta.env.DEV) return '/api';
  return 'http://localhost:4000/api';
}

const api = axios.create({
  baseURL: resolveApiBase(),
});
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
export default api;