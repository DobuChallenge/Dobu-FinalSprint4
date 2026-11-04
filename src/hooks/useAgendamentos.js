import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { agendamentoMutationOptions, agendamentoQuery, agendamentosQuery } from '../services/queries';

export function useAgendamentos({ live = false } = {}) {
  const { user } = useAuth();
  return useQuery({ ...agendamentosQuery(user), refetchInterval: live ? 30000 : false, refetchOnWindowFocus: 'always' });
}

export function useAgendamento(id) {
  const { user } = useAuth();
  return useQuery(agendamentoQuery(user, id));
}

export function useAgendamentoMutations() {
  const { user } = useAuth();
  const client = useQueryClient();
  return {
    salvar: useMutation(agendamentoMutationOptions(client, user, 'salvar')),
    excluir: useMutation(agendamentoMutationOptions(client, user, 'excluir')),
  };
}
