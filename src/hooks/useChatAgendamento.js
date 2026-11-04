import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useAgendamento } from './useAgendamentos';
import { chatAgendamentoApi } from '../api/chatAgendamento';
import { accountKey } from '../services/queries';

export function useChatAgendamento(id) {
  const { user } = useAuth();
  const appointment = useAgendamento(id);
  const client = useQueryClient();
  const key = [...accountKey(user), 'chat', id];
  const query = useQuery({ queryKey: key, queryFn: () => chatAgendamentoApi.listar(id), enabled: Boolean(appointment.data), retry: false, refetchInterval: 5000 });
  const [texto, setTexto] = useState('');
  const mutation = useMutation({ mutationFn: (dados) => chatAgendamentoApi.enviar(id, dados.texto, dados.tipo), retry: false,
    onSuccess: () => client.invalidateQueries({ queryKey: key }) });
  const mensagens = query.data || [];
  const confirmacoes = mensagens.filter((item) => item.tipo === 'CONFIRMACAO');
  async function enviar(tipo = 'MENSAGEM') {
    if (!appointment.data || mutation.isPending || (tipo === 'MENSAGEM' && !texto.trim())) return;
    try { await mutation.mutateAsync({ texto: tipo === 'MENSAGEM' ? texto.trim() : '', tipo }); setTexto(''); } catch { }
  }
  return { user, mensagens, texto, setTexto, enviar,
    carregar: () => { appointment.refetch(); query.refetch(); },
    carregando: appointment.isPending || (Boolean(appointment.data) && query.isPending),
    enviando: mutation.isPending,
    erro: appointment.error?.message || query.error?.message || mutation.error?.message || '',
    confirmou: { responsavel: confirmacoes.some((m) => m.autorTipo === 'RESPONSAVEL'), veterinario: confirmacoes.some((m) => m.autorTipo === 'VETERINARIO') },
    souVeterinario: user.tipoConta === 'veterinario',
  };
}
