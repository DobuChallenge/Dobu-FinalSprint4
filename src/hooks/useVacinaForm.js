import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { vacinasApi } from '../api/vacinas';
import { accountKey } from '../services/queries';
import { vacinaPayload } from '../services/vacinas';

const empty = { nome: '', dataAplicacao: '', dataProximaDose: '' };
export function useVacinaForm(petId) {
  const { user } = useAuth();
  const client = useQueryClient();
  const [draft, setDraft] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => { setDraft(empty); setError(''); setSuccess(''); }, [petId]);
  const mutation = useMutation({ mutationFn: (data) => vacinasApi.criar(data), retry: false,
    onSuccess: () => client.invalidateQueries({ queryKey: [...accountKey(user), 'vacinas'] }) });
  function setField(field, value) { setDraft((old) => ({ ...old, [field]: value })); setError(''); setSuccess(''); }
  async function salvar() {
    if (mutation.isPending) return;
    setError(''); setSuccess('');
    try { await mutation.mutateAsync(vacinaPayload(draft, petId)); setDraft(empty); setSuccess('Vacina registrada.'); }
    catch (err) { setError(err.message || 'Não foi possível registrar a vacina.'); }
  }
  return { draft, setField, salvar, error, success, saving: mutation.isPending };
}
