import { Text } from 'react-native';
import Card from './Card';
import TextInput from './TextInput';
import Button from './Button';
import { useVacinaForm } from '../hooks/useVacinaForm';
import { useAppStyles } from '../hooks/useAppStyles';

export default function VacinaForm({ petId }) {
  const { ui } = useAppStyles();
  const form = useVacinaForm(petId);
  return <Card>
    <Text style={ui.title}>Registrar vacina</Text>
    <TextInput label="Nome da vacina" value={form.draft.nome} onChangeText={(value) => form.setField('nome', value)} editable={!form.saving} />
    <TextInput label="Data da aplicação" placeholder="DD/MM/AAAA" value={form.draft.dataAplicacao} onChangeText={(value) => form.setField('dataAplicacao', value)} editable={!form.saving} />
    <TextInput label="Próxima dose (opcional)" placeholder="DD/MM/AAAA" value={form.draft.dataProximaDose} onChangeText={(value) => form.setField('dataProximaDose', value)} editable={!form.saving} />
    {!!form.error && <Text style={ui.error}>{form.error}</Text>}
    {!!form.success && <Text accessibilityLiveRegion="polite" style={ui.body}>{form.success}</Text>}
    <Button title={form.saving ? 'Salvando…' : 'Registrar vacina'} disabled={!petId || form.saving} onPress={form.salvar} />
  </Card>;
}
