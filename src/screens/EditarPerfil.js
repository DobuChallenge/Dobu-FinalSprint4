import { StyleSheet, Text, View } from 'react-native';
import { useAppStyles } from '../hooks/useAppStyles';
import { useEditarPerfil } from '../hooks/useEditarPerfil';
import Button from '../components/Button';
import Card from '../components/Card';
import PhotoPicker from '../components/PhotoPicker';
import Screen from '../components/Screen';
import TextInput from '../components/TextInput';

export default function EditarPerfil({ navigation }) {
  const { ui, styles } = useAppStyles(createStyles);
  const { user, draft, error, salvando, excluindo, setField, salvar, confirmarExclusao } = useEditarPerfil(navigation);
  return (
    <Screen navigation={navigation} title="Editar perfil" subtitle="Atualize seus dados da conta" active="perfil">
      <Card style={styles.card}>
        <PhotoPicker photo={draft.foto} onChangePhoto={(value) => setField('foto', value)} title="Foto de perfil" disabled={salvando || excluindo} />
        <TextInput label="Nome" value={draft.nome} onChangeText={(value) => setField('nome', value)} placeholder="Seu nome" editable={!salvando && !excluindo} />
        <TextInput label="Email" value={draft.email} onChangeText={(value) => setField('email', value)} placeholder="seu@email.com" keyboardType="email-address" editable={!salvando && !excluindo} />
        <TextInput label="Senha atual" value={draft.senha} onChangeText={(value) => setField('senha', value)} placeholder="Digite sua senha atual" secureTextEntry editable={!salvando && !excluindo} />
        <TextInput label="Telefone" value={draft.telefone} onChangeText={(value) => setField('telefone', value)} placeholder="Seu telefone" keyboardType="phone-pad" editable={!salvando && !excluindo} />

        {user.tipoConta === 'veterinario' ? (
          <View style={styles.profissional}>
            <Text style={ui.title}>Dados profissionais</Text>
            <TextInput label="CRMV" value={draft.crmv} onChangeText={(value) => setField('crmv', value)} placeholder="Ex.: 12345" editable={!salvando && !excluindo} />
            <TextInput label="UF do CRMV" value={draft.ufCrmv} onChangeText={(value) => setField('ufCrmv', value.toUpperCase())} placeholder="Ex.: SP" editable={!salvando && !excluindo} />
            <TextInput label="Clínica" value={draft.clinica} onChangeText={(value) => setField('clinica', value)} placeholder="Nome da clínica" editable={!salvando && !excluindo} />
            <TextInput label="Especialidade" value={draft.especialidade} onChangeText={(value) => setField('especialidade', value)} placeholder="Ex.: clínica geral" editable={!salvando && !excluindo} />
          </View>
        ) : null}

        {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
        <View style={ui.actions}>
          <Button title={salvando ? 'Salvando...' : 'Salvar perfil'} icon="checkmark-circle-outline" cor="cinzaEscuro" onPress={salvando ? undefined : salvar} disabled={salvando || excluindo} />
          <Button title={excluindo ? 'Excluindo...' : 'Excluir conta'} icon="trash-outline" cor="vermelho" onPress={confirmarExclusao} disabled={salvando || excluindo} />
        </View>
      </Card>
    </Screen>
  );
}

const createStyles = (cores) => StyleSheet.create({
  card: {
    backgroundColor: cores.principal,
  },
  profissional: {
    marginTop: 8,
  },
});
