import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeToggle } from '../hooks/useThemeToggle';
import { useAuth } from '../hooks/useAuth';
import DobuLogo from './DobuLogo';

export default function ThemeToggle() {
  const { user } = useAuth();
  const { mode, colors, saving, error, toggle } = useThemeToggle();
  const label = mode === 'dark' ? 'Modo claro' : 'Modo escuro';
  return <SafeAreaView edges={['top']} style={{ backgroundColor: colors.fundo }}>
    <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Muda a aparência do aplicativo" accessibilityState={{ disabled: saving }} disabled={saving} onPress={toggle}
      style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 12, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.fundoClaro, borderWidth: 1, borderColor: colors.cinza, opacity: pressed || saving ? 0.65 : 1 })}>
      <Ionicons name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={19} color={colors.texto} />
      <Text style={{ color: colors.texto, fontSize: 13, fontWeight: '600' }}>{label}</Text>
    </Pressable>
    {user ? <DobuLogo small /> : null}
    </View>
    {!!error && <Text accessibilityRole="alert" style={{ color: colors.vermelho, backgroundColor: colors.fundoClaro, padding: 8 }}>{error}</Text>}
  </SafeAreaView>;
}
