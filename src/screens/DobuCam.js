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

export default function DobuCam({ navigation, route }) {
  const { ui, cores } = useAppStyles();
  const { pets, cameras, petId, setSelected } = useCameras(route.params?.petId);
  const monitor = useDobuCam(route.params?.cameraId || petId);
  const markers = useBowlMarkers(monitor.urls);
  return <Screen navigation={navigation} title="Dobu-Cam" subtitle="Acompanhe seu animal">
    <Card>
      <Text style={ui.title}>Câmera ao vivo</Text>
      <Text style={ui.badge}>{monitor.reading?.online ? 'Online' : 'Aguardando imagem recente'}</Text>
      {!!monitor.frame && <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: cores.campo, borderRadius: 16, overflow: 'hidden' }} onLayout={(event) => markers.setSize(event.nativeEvent.layout)} {...markers.handlers}>
        <View pointerEvents="none" style={{ flex: 1 }}>
          <Image source={{ uri: markers.frozen || monitor.frame }} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
          {['food', 'water'].map((kind) => markers.areas[kind] && <View key={kind} style={{ position: 'absolute', left: `${markers.areas[kind].x * 100}%`, top: `${markers.areas[kind].y * 100}%`, width: `${markers.areas[kind].width * 100}%`, height: `${markers.areas[kind].height * 100}%`, borderWidth: 2, borderColor: kind === 'food' ? '#FF8C28' : '#55A5D9' }}><Text numberOfLines={1} style={{ position: 'absolute', top: -17, left: 0, width: 64, fontSize: 11, color: '#FFFFFF', backgroundColor: '#333333' }}>{kind === 'food' ? 'COMIDA' : 'ÁGUA'}</Text></View>)}
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
      {monitor.reading?.descanso && <Text style={ui.body}>Possível descanso: pouca atividade por mais de uma hora.</Text>}
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
      <Text style={ui.title}>Conectar câmera externa</Text>
      <Text style={ui.caption}>Abra a transmissão no celular e informe o IP exibido. Mantenha o celular e o computador na mesma rede Wi-Fi.</Text>
      <TextInput label="Endereço da Dobu-Cam" placeholder="http://IP-DO-SERVIDOR:5000" value={monitor.endpoint} onChangeText={monitor.setEndpoint} keyboardType="url" editable={monitor.settingsReady && !monitor.sourceBusy} />
      <TextInput label="IP ou endereço da câmera externa" placeholder="192.168.15.5:8080" value={monitor.externalUrl} onChangeText={monitor.setExternalUrl} keyboardType="url" editable={monitor.settingsReady && !monitor.sourceBusy} />
      {!!monitor.settingsError && <Text style={ui.error}>{monitor.settingsError}</Text>}
      <View style={ui.actions}>
        <Button title={!monitor.settingsReady ? 'Carregando endereço…' : monitor.sourceBusy ? 'Conectando…' : 'Ligar câmera externa'} disabled={monitor.sourceBusy || !monitor.settingsReady} onPress={monitor.conectar} />
        <Button title="Parar captura" disabled={monitor.sourceBusy} cor="cinzaEscuro" onPress={monitor.pararCaptura} />
        <Button title="Parar visualização" cor="cinzaEscuro" onPress={monitor.parar} />
        <Button title="Gerenciar câmeras" cor="branco" onPress={() => navigation.navigate('MinhasCameras')} />
      </View>
    </Card>
  </Screen>;
}
