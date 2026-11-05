import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import { useAppStyles } from '../hooks/useAppStyles';
import Card from './Card';

export default function ThemeSelector() {
  const { preference, setPreference } = useTheme();
  const { ui, cores, styles } = useAppStyles(createStyles);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function escolher(value) {
    setSaving(true);
    setError('');
    try { await setPreference(value); } catch { setError('Não foi possível salvar o tema. Tente novamente.'); }
    finally { setSaving(false); }
  }
  return <Card>
    <Text style={ui.title}>Aparência</Text>
    <View accessibilityRole="radiogroup" accessibilityLabel="Tema do aplicativo" style={styles.options}>
      {[['system', 'Sistema', 'phone-portrait-outline'], ['light', 'Claro', 'sunny-outline'], ['dark', 'Escuro', 'moon-outline']].map(([value, label, icon]) =>
        <Pressable key={value} accessibilityRole="radio" accessibilityLabel={value === 'system' ? 'Seguir tema do celular' : `Tema ${label.toLowerCase()}`} accessibilityState={{ checked: preference === value, disabled: saving }} disabled={saving} onPress={() => escolher(value)}
          style={({ pressed }) => [styles.option, preference === value && styles.selected, (pressed || saving) && { opacity: 0.65 }]}>
          <Ionicons name={icon} size={22} color={cores.texto} />
          <Text style={styles.label}>{label}</Text>
        </Pressable>)}
    </View>
    {!!error && <Text style={ui.error}>{error}</Text>}
  </Card>;
}

const createStyles = (cores) => StyleSheet.create({
  options: { flexDirection: 'row', gap: 6, padding: 5, borderRadius: 16, backgroundColor: cores.fundo, marginTop: 12 },
  option: { flex: 1, minWidth: 0, minHeight: 72, paddingVertical: 12, paddingHorizontal: 4, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderColor: 'transparent' },
  selected: { backgroundColor: cores.amareloClaro, borderColor: cores.principalEscuro },
  label: { color: cores.texto, fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
