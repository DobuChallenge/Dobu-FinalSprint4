import { useLoginForm } from '../hooks/useAuthForms';
import { useAppStyles } from '../hooks/useAppStyles';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import Card from '../components/Card';
import DobuLogo from '../components/DobuLogo';


export default function Login({ navigation }) {
  const { cores, estilos } = useAppStyles();
  const { email, setEmail, senha, setSenha, entrando, entrar } = useLoginForm();

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <DobuLogo
          large
          style={{
            alignSelf: 'center',
            marginTop: 60,
            marginBottom: 18,
          }}
        />

        <Header navigation={navigation} title="Login" subtitle="Entre na sua conta" />

        <Card
          style={{
            backgroundColor: cores.principal,
            borderRadius: 18,
            paddingVertical: 22,
          }}
        >
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
          />

          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          <Button
            title={entrando ? 'Entrando...' : 'Login'}
            onPress={entrando ? undefined : entrar}
            disabled={entrando}
            style={{ marginHorizontal: 34 }}
            cor="cinzaEscuro"
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
