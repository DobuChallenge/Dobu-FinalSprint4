import { useAppStyles } from '../hooks/useAppStyles';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

export default function Screen({ navigation, title, subtitle, active, children }) {
  const { estilos } = useAppStyles();
  const { user } = useAuth();
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={estilos.tela}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <Header navigation={navigation} title={title} subtitle={subtitle} />
          <View style={{ gap: 16 }}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavigation navigation={navigation} active={active} homeRoute={user?.tipoConta === 'veterinario' ? 'PerfilVeterinario' : 'Inicio'} />
    </SafeAreaView>
  );
}
