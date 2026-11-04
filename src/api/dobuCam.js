import { request, requestDeviceJson } from './httpClient.js';

export const dobuCamApi = {
  selecionarFonte: (base, source, url) => requestDeviceJson(`${base}/camera-source`, { method: 'POST', body: { source, url }, timeoutMs: 20000 }),
  iniciarAnaliseExemplo: (base) => requestDeviceJson(`${base}/demo-analysis`, { method: 'POST', body: {} }),
  consultarAnaliseExemplo: (base) => requestDeviceJson(`${base}/demo-analysis`),
  analisarConsumo: (base, area, kind) => requestDeviceJson(`${base}/${kind === 'food' ? 'processar-demo' : 'processar-hidratacao-demo'}`, { method: 'POST', body: { bowl_roi: area }, timeoutMs: 120000 }),
  criar: (dados) => request('/api/dobucams', { method: 'POST', body: dados }),
  listarPorPet: (id) => request(`/api/dobucams/pet/${encodeURIComponent(id)}`),
  lerStatus: (urlStatus) => requestDeviceJson(urlStatus),
  lerConfiguracao: (url) => requestDeviceJson(url),
  salvarConfiguracao: (url, dados) => requestDeviceJson(url, { method: 'POST', body: dados }),
};
