import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== 'undefined' && window.location.port === '8000') {
    return '/api';
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://supplyiq-28k3.onrender.com/api';
  }
  return 'http://localhost:8000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

export const checkHealth = () => api.get('/health').then(res => res.data);
export const getSummary = () => api.get('/summary').then(res => res.data);
export const getProducts = () => api.get('/products').then(res => res.data);
export const getForecast = (sku_id, horizon_days) => api.post('/forecast', { sku_id, horizon_days }).then(res => res.data);
export const getInventoryRisk = (sku_id) => api.post('/inventory-risk', sku_id ? { sku_id } : {}).then(res => res.data);
export const getDelayRisk = () => api.get('/delay-risk').then(res => res.data);
export const getModelPerformance = () => api.get('/model-performance').then(res => res.data);
export const getModelDrift = () => api.get('/model-drift').then(res => res.data);
export const triggerRetrain = () => api.post('/retrain', {}).then(res => res.data);
export const getSystemInfo = () => api.get('/system-info').then(res => res.data);
export const getAcademicInfo = () => api.get('/system-info').then(res => res.data);
export const getAnalytics = () => api.get('/analytics').then(res => res.data);
export const getDataQuality = () => api.get('/data-quality').then(res => res.data);
export const getHistory = (sku_id) => api.get(`/history?sku_id=${encodeURIComponent(sku_id)}`).then(res => res.data);

export default api;
