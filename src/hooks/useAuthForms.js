import { useState } from 'react';
import { Alert } from 'react-native';
import { useLogin, useRegister } from './useAuth';
import { validateLogin, validateRegister } from '../utils/authValidation';
import { ApiError } from '../api/httpClient';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const login = useLogin();
  const entrando = login.isPending;

  async function entrar() {
    const emailTratado = email.trim().toLowerCase();
    if (entrando) return;
    const erroValidacao = validateLogin(emailTratado, senha);
    if (erroValidacao) {
      Alert.alert('Confira os dados', erroValidacao);
      return;
    }

    try {
      await login.mutateAsync({ email: emailTratado, senha });
      setSenha('');
      Alert.alert('Bem-vindo!', 'Login realizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro ao entrar', error instanceof ApiError ? error.message : 'Não foi possível fazer login.');
    } finally {
      login.reset();
    }
  }

  return { email, setEmail, senha, setSenha, entrando, entrar };
}

export function useCadastroForm() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoConta, setTipoConta] = useState('responsavel');
  const [foto, setFoto] = useState('');
  const [telefone, setTelefone] = useState('');
  const [crmv, setCrmv] = useState('');
  const [ufCrmv, setUfCrmv] = useState('');
  const [clinica, setClinica] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const cadastro = useRegister();
  const salvando = cadastro.isPending;

  async function cadastrar() {
    if (salvando) return;
    const dados = { nome: nomeUsuario.trim(), email: emailUsuario.trim().toLowerCase(), senha, tipoUsuario: tipoConta.toUpperCase() };
    const erroValidacao = validateRegister(dados);
    if (erroValidacao) {
      Alert.alert('Confira os dados', erroValidacao);
      return;
    }
    try {
      const profileExtras = {
        foto,
        telefone: telefone.trim(),
        crmv: crmv.trim(),
        ufCrmv: ufCrmv.trim().toUpperCase(),
        clinica: clinica.trim(),
        especialidade: especialidade.trim(),
      };
      await cadastro.mutateAsync({
        ...dados,
        profileExtras,
      });
    } catch (error) {
      cadastro.reset();
      Alert.alert('Erro no cadastro', error instanceof ApiError ? error.message : 'Não foi possível realizar o cadastro.');
    }
  }

  return { nomeUsuario, setNomeUsuario, emailUsuario, setEmailUsuario, senha, setSenha, tipoConta, setTipoConta, foto, setFoto, telefone, setTelefone, crmv, setCrmv, ufCrmv, setUfCrmv, clinica, setClinica, especialidade, setEspecialidade, salvando, cadastrar };
}
