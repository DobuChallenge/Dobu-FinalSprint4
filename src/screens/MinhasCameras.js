import { useState } from 'react';
import { Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import SelectField from '../components/SelectField';
import QueryState from '../components/QueryState';
import { useCameras } from '../hooks/useCameras';
import { useAppStyles } from '../hooks/useAppStyles';

export default function MinhasCameras({ navigation }) {
  const { ui } = useAppStyles();
  const { pets, cameras, petId, setSelected, criar } = useCameras();
  const [nome, setNome] = useState('');
  async function salvar() { try { await criar.mutateAsync(nome); setNome(''); } catch {} }
  return <Screen navigation={navigation} title="Dobu-Cams" subtitle="Acompanhe seu pet">
    <QueryState query={pets} empty={!pets.data?.length} emptyTitle="Nenhum animal cadastrado" emptyMessage="Cadastre um animal para vincular suas câmeras.">
      <Card>
        <SelectField label="Animal" value={petId} onChange={setSelected} options={(pets.data || []).map((pet) => ({ value: pet.id, label: pet.nome }))} />
        <TextInput label="Nome da câmera" value={nome} onChangeText={setNome} placeholder="Ex.: Sala" editable={!criar.isPending} />
        {!!criar.error && <Text style={ui.error}>{criar.error.message}</Text>}
        <Button title={criar.isPending ? 'Salvando…' : 'Adicionar câmera'} onPress={salvar} disabled={criar.isPending || !petId} />
      </Card>
      <QueryState query={cameras} empty={!cameras.data?.length} emptyTitle="Nenhuma câmera" emptyMessage="Adicione uma câmera para acompanhar este animal.">
        {(cameras.data || []).map((camera) => <Card key={camera.id}>
          <Text style={ui.title}>{camera.localizacao}</Text>
          <Button title="Abrir monitor" onPress={() => navigation.navigate('DobuCam', { cameraId: camera.id, petId })} />
        </Card>)}
      </QueryState>
    </QueryState>
    <View style={ui.actions}><Button title="Cadastrar animal" cor="cinzaEscuro" onPress={() => navigation.navigate('CadastroPet')} /></View>
  </Screen>;
}
