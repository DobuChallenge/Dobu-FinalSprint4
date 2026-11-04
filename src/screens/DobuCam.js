import { Image, Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import SelectField from '../components/SelectField';
import QueryState from '../components/QueryState';
import { useCameras } from '../hooks/useCameras';
import { useDobuCam } from '../hooks/useDobuCam';
import { useBowlMarkers } from '../hooks/useBowlMarkers';
import { useAppStyles } from '../hooks/useAppStyles';

export default function DobuCam({ navigation }) {
  const { ui, cores } = useAppStyles();
  const { pets, cameras, petId, setSelected } = useCameras();
  const monitor = useDobuCam();
  const markers = useBowlMarkers(monitor.urls);
  return <Screen navigation={navigation} title="Dobu-Cam" subtitle="Acompanhe seu animal">
    <Card>
      <Text style={ui.title}>Câmera ao vivo</Text>
      {monitor.reading?.exemplo && <Text style={ui.badge}>Gravação de exemplo</Text>}
      {!!monitor.frame && <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: cores.campo, borderRadius: 16, overflow: 'hidden' }} onLayout={(event) => markers.setSize(event.nativeEvent.layout)} {...markers.handlers}>
        <View pointerEvents="none" style={{ flex: 1 }}>
          <Image source={{ uri: markers.frozen || monitor.frame }} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
          {['food', 'water'].map((kind) => markers.areas[kind] && <View key={kind} style={{ position: 'absolute', left: `${markers.areas[kind].x * 100}%`, top: `${markers.areas[kind].y * 100}%`, width: `${markers.areas[kind].width * 100}%`, height: `${markers.areas[kind].height * 100}%`, borderWidth: 2, borderColor: kind === 'food' ? '#FF8C28' : '#55A5D9' }}><Text style={{ color: '#FFFFFF', backgroundColor: '#333333' }}>{kind === 'food' ? 'COMIDA' : 'ÁGUA'}</Text></View>)}
        </View>
      </View>}
      <View style={ui.actions}>
        <Button title="Marcar pote de comida" disabled={!monitor.frame} onPress={() => markers.marcar('food', monitor.frame)} />
        <Button title="Marcar pote de água" disabled={!monitor.frame} onPress={() => markers.marcar('water', monitor.frame)} />
        {!!markers.selected && <Text style={ui.caption}>Arraste um retângulo na imagem congelada.</Text>}
        <Button title="Salvar marcações" disabled={!monitor.urls || markers.saving} onPress={markers.salvar} />
        {!!markers.frozen && <Button title="Retomar câmera" cor="cinzaEscuro" onPress={markers.retomar} />}
        {!!markers.error && <Text style={ui.error}>{markers.error}</Text>}
      </View>
      <Text style={ui.body}>Presença: {monitor.reading?.presente ? 'Animal identificado' : 'Sem animal identificado'}</Text>
      <Text style={ui.body}>Movimento: {!monitor.reading?.presente ? 'Aguardando animal' : monitor.reading.movimento ? 'Em movimento' : 'Pouco movimento'}</Text>
      {!!monitor.reading?.especie && <Text style={ui.caption}>Animal: {monitor.reading.especie}</Text>}
      <Text style={ui.caption}>A observação da rotina não substitui a avaliação veterinária.</Text>
      {!!monitor.error && <Text style={ui.error}>{monitor.error}</Text>}
    </Card>
    <Text style={ui.heading}>Eventos da câmera</Text>
    {monitor.events.map((event, index) => <Card key={`${event.timestamp}-${index}`}><Text style={ui.body}>{event.message}</Text><Text style={ui.caption}>{event.timestamp ? new Date(event.timestamp).toLocaleString('pt-BR') : ''}</Text></Card>)}
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
