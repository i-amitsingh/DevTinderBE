import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios';

// Enable cookies on cross-site requests globally for axios
axios.defaults.withCredentials = true;
// Restore Authorization header fallback from token stored in localStorage (dev fallback to avoid cookie issues)
const savedToken = localStorage.getItem("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

// Ensure axios always adds Authorization header with any saved token before each request
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      (config.headers as any) = config.headers || {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

createRoot(document.getElementById('root')!).render(
  <App />
)
