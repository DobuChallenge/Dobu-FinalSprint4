import { useAppStyles } from '../hooks/useAppStyles';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Header({ title, subtitle, navigation, showBack = true }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  const { user } = useAuth();
  const telaPrincipal = title === 'Meu perfil' || title?.startsWith('Olá,') || title?.startsWith('Veterin');
  const mostrarVoltar = showBack && !telaPrincipal && navigation?.canGoBack?.();

  function voltar() {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    if (user?.tipoConta === 'veterinario') {
      navigation?.navigate?.('PerfilVeterinario');
      return;
    }
    if (user) {
      navigation?.navigate?.('Inicio');
      return;
    }
    navigation?.navigate?.('Inicial');
  }

  return (
    <View style={styles.container}>
      {mostrarVoltar ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={voltar} style={styles.voltar}>
          <Ionicons name="chevron-back" size={22} color={cores.branco} />
        </Pressable>
      ) : null}
      <View style={styles.textos}>
          <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const createStyles = (cores) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  voltar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: cores.principal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textos: {
    flex: 1,
  },
  title: {
    color: cores.marrom,
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: cores.textoClaro,
    fontSize: 17,
    marginTop: 5,
  },
});
