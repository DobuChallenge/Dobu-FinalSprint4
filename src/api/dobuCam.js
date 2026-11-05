import { request, requestDeviceJson } from './httpClient.js';

export const dobuCamApi = {
  conectarExterna: (base, url) => requestDeviceJson(`${base}/camera-source`, { method: 'POST', body: { source: 'celular', url }, timeoutMs: 20000 }),
  conectarDemo: (base) => requestDeviceJson(`${base}/camera-source`, { method: 'POST', body: { source: 'exemplo' }, timeoutMs: 20000 }),
  pararCaptura: (base) => requestDeviceJson(`${base}/camera-source`, { method: 'POST', body: { source: 'stop' }, timeoutMs: 20000 }),
  consultarFonte: (base) => requestDeviceJson(`${base}/camera-source`),
  criar: (dados) => request('/api/dobucams', { method: 'POST', body: dados }),
  listarPorPet: (id) => request(`/api/dobucams/pet/${encodeURIComponent(id)}`),
  lerStatus: (urlStatus) => requestDeviceJson(urlStatus),
  lerConfiguracao: (url) => requestDeviceJson(url),
  salvarConfiguracao: (url, dados) => requestDeviceJson(url, { method: 'POST', body: dados }),
};
