import { request, requestDeviceJson } from './httpClient.js';

export const dobuCamApi = {
  criar: (dados) => request('/api/dobucams', { method: 'POST', body: dados }),
  listarPorPet: (id) => request(`/api/dobucams/pet/${encodeURIComponent(id)}`),
  lerStatus: (urlStatus) => requestDeviceJson(urlStatus),
  lerConfiguracao: (url) => requestDeviceJson(url),
  salvarConfiguracao: (url, dados) => requestDeviceJson(url, { method: 'POST', body: dados }),
};
