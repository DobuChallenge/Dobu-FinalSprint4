import { request } from './httpClient.js';

export const chatAgendamentoApi = {
  listar: (id) => request(`/api/agendamentos/${encodeURIComponent(id)}/chat`),
  enviar: (id, texto, tipo = 'MENSAGEM') => request(`/api/agendamentos/${encodeURIComponent(id)}/chat`, { method: 'POST', body: { texto, tipo } }),
};
