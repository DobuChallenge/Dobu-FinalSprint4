import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuarios';
import { useAuth, useUpdateCurrentUser } from './useAuth';
import { useProfileExtras } from './useProfileExtras';
import { removeProfileExtras, saveProfileExtras } from '../storage/profileExtrasStorage';

export function useEditarPerfil(navigation) {
  const { user, logout } = useAuth();
  const extras = useProfileExtras(user);
  const atualizarSessao = useUpdateCurrentUser();
  const atualizarUsuario = useMutation({ mutationFn: ({ id, dados }) => usuariosApi.atualizar(id, dados), retry: false });
  const excluirUsuario = useMutation({ mutationFn: usuariosApi.excluir, retry: false });
  const initialized = useRef(false);
  const [draft, setDraft] = useState({
    nome: user.nome,
    email: user.email,
    senha: '',
    foto: '',
    telefone: '',
    crmv: '',
    ufCrmv: '',
    clinica: '',
    especialidade: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialized.current || !extras.updatedAt) return;
    initialized.current = true;
    setDraft((current) => ({
      ...current,
      foto: extras.foto || '',
      telefone: extras.telefone || '',
      crmv: extras.crmv || '',
      ufCrmv: extras.ufCrmv || '',
      clinica: extras.clinica || '',
      especialidade: extras.especialidade || '',
    }));
  }, [extras]);

  const salvando = atualizarUsuario.isPending || atualizarSessao.isPending;
  const excluindo = excluirUsuario.isPending;

  function setField(field, value) {
    setError('');
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function salvar() {
    const nome = draft.nome.trim();
    const email = draft.email.trim().toLowerCase();
    const alterouConta = nome !== user.nome || email !== user.email;

    if (nome.length < 2) {
      setError('Informe um nome com pelo menos 2 caracteres.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Digite um email válido.');
      return;
    }
    if (alterouConta && draft.senha.length < 6) {
      setError('Digite sua senha atual para alterar nome ou email.');
      return;
    }

    const profileExtras = {
      foto: draft.foto,
      telefone: draft.telefone.trim(),
      crmv: draft.crmv.trim(),
      ufCrmv: draft.ufCrmv.trim().toUpperCase(),
      clinica: draft.clinica.trim(),
      especialidade: draft.especialidade.trim(),
      tipoConta: user.tipoConta,
    };

    try {
      if (alterouConta) {
        await atualizarUsuario.mutateAsync({
          id: user.id,
          dados: {
            nome,
            email,
            senha: draft.senha,
            tipoUsuario: user.tipoConta.toUpperCase(),
          },
        });
      }

      await saveProfileExtras({ id: user.id, email }, profileExtras);

      if (alterouConta) {
        if (email !== user.email) await removeProfileExtras({ email: user.email });
        await atualizarSessao.mutateAsync({ nome, email, tipoUsuario: user.tipoConta.toUpperCase() });
      }

      navigation.navigate(user.tipoConta === 'veterinario' ? 'PerfilVeterinario' : 'PerfilUsuario', { profileExtras });
    } catch (saveError) {
      setError(saveError?.message || 'Não foi possível salvar suas alterações.');
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir conta',
      'Deseja excluir sua conta? Se ainda houver animais ou agendamentos no seu perfil, apague eles antes.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirUsuario.mutateAsync(user.id);
              await removeProfileExtras(user);
              await logout();
            } catch (deleteError) {
              Alert.alert('Não foi possível excluir', deleteError?.message || 'Apague seus animais e agendamentos e tente novamente.');
            }
          },
        },
      ],
    );
  }

  return { user, draft, error, salvando, excluindo, setField, salvar, confirmarExclusao };
}
