import { useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { useAppStyles } from '../hooks/useAppStyles';
import Button from './Button';
import Card from './Card';

export default function ThemeSelector() {
  const { preference, setPreference } = useTheme();
  const { ui } = useAppStyles();
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
    <View style={ui.actions}>
      {[['system', 'Usar tema do celular'], ['light', 'Tema claro'], ['dark', 'Tema escuro']].map(([value, label]) =>
        <Button key={value} title={`${preference === value ? '✓ ' : ''}${label}`} disabled={saving} cor={preference === value ? 'amarelo' : 'cinzaEscuro'} onPress={() => escolher(value)} />)}
    </View>
    {!!error && <Text style={ui.error}>{error}</Text>}
  </Card>;
}
