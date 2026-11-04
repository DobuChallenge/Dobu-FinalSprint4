import { Image, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import SelectField from '../components/SelectField';
import QueryState from '../components/QueryState';
import { useCameras } from '../hooks/useCameras';
import { useDobuCam } from '../hooks/useDobuCam';
import { useAppStyles } from '../hooks/useAppStyles';

export default function DobuCam({ navigation }) {
  const { ui, cores } = useAppStyles();
  const { pets, cameras, petId, setSelected } = useCameras();
  const monitor = useDobuCam();
  return <Screen navigation={navigation} title="Dobu-Cam" subtitle="Acompanhe seu animal">
    <Card>
      <Text style={ui.title}>Câmera ao vivo</Text>
      {monitor.reading?.exemplo && <Text style={ui.badge}>Gravação de exemplo</Text>}
      {!!monitor.frame && <Image source={{ uri: monitor.frame }} style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: cores.campo, borderRadius: 16 }} resizeMode="contain" />}
      <Text style={ui.body}>Presença: {monitor.reading?.presente ? 'Animal identificado' : 'Sem animal identificado'}</Text>
      <Text style={ui.body}>Movimento: {!monitor.reading?.presente ? 'Aguardando animal' : monitor.reading.movimento ? 'Em movimento' : 'Pouco movimento'}</Text>
      {!!monitor.reading?.especie && <Text style={ui.caption}>Animal: {monitor.reading.especie}</Text>}
      <Text style={ui.caption}>A observação da rotina não substitui a avaliação veterinária.</Text>
      {!!monitor.error && <Text style={ui.error}>{monitor.error}</Text>}
    </Card>
    <QueryState query={pets}>
      <SelectField label="Animal" value={petId} onChange={setSelected} options={(pets.data || []).map((pet) => ({ value: pet.id, label: pet.nome }))} />
      <QueryState query={cameras} empty={!cameras.data?.length} emptyTitle="Nenhuma câmera cadastrada" emptyMessage="Adicione uma câmera para este animal.">
        {(cameras.data || []).map((camera) => <Card key={camera.id}><Text style={ui.title}>{camera.localizacao}</Text><Text style={ui.body}>{camera.statusCamera}</Text></Card>)}
      </QueryState>
    </QueryState>
    <Card>
      <TextInput label="Endereço da Dobu-Cam" placeholder="http://IP-DO-SERVIDOR:5000" value={monitor.endpoint} onChangeText={monitor.setEndpoint} autoCapitalize="none" />
      <View style={ui.actions}>
        <Button title={monitor.connecting ? 'Conectando…' : 'Conectar câmera'} disabled={monitor.connecting} onPress={monitor.conectar} />
        <Button title="Parar visualização" cor="cinzaEscuro" onPress={monitor.parar} />
        <Button title="Gerenciar câmeras" cor="branco" onPress={() => navigation.navigate('MinhasCameras')} />
      </View>
    </Card>
  </Screen>;
}
