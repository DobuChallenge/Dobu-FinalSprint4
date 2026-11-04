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
import { useCameraAnalysis } from '../hooks/useCameraAnalysis';
import { useAppStyles } from '../hooks/useAppStyles';

export default function DobuCam({ navigation, route }) {
  const { ui, cores } = useAppStyles();
  const { pets, cameras, petId, setSelected } = useCameras(route.params?.petId);
  const monitor = useDobuCam();
  const markers = useBowlMarkers(monitor.urls);
  const analysis = useCameraAnalysis(monitor.urls, monitor.reading?.exemplo ? 'exemplo' : monitor.source, markers.areas, markers.saved);
  return <Screen navigation={navigation} title="Dobu-Cam" subtitle="Acompanhe seu animal">
    <Card>
      <Text style={ui.title}>Câmera ao vivo</Text>
      <Text style={ui.badge}>{monitor.reading?.online ? 'Online' : 'Aguardando imagem recente'}</Text>
      {monitor.reading?.exemplo && <Text style={ui.badge}>Gravação de exemplo</Text>}
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
    <Card>
      <Text style={ui.title}>Acompanhamento da alimentação e hidratação</Text>
      <Text style={ui.body}>Consulte o processamento da gravação pelo serviço de análise.</Text>
      <View style={ui.actions}>
        <Button title="Analisar alimentação" disabled={analysis.busy} onPress={() => analysis.analisar('food')} />
        <Button title="Analisar hidratação" disabled={analysis.busy} cor="cinzaEscuro" onPress={() => analysis.analisar('water')} />
      </View>
      {analysis.busy && <Text style={ui.caption}>Analisando a gravação…</Text>}
      {!!analysis.error && <Text style={ui.error}>{analysis.error}</Text>}
      {!!analysis.result && <Text style={ui.body}>{analysis.kind === 'food' ? 'Possível alimentação' : 'Possível hidratação'}: {analysis.result.quantidade_eventos ?? analysis.result.eventos?.length ?? 0} evento(s).</Text>}
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
      <TextInput label="Endereço da câmera externa" placeholder="http://IP-DA-CAMERA:8080/video" value={monitor.externalUrl} onChangeText={monitor.setExternalUrl} autoCapitalize="none" />
      <View style={ui.actions}>
        <Button title="Câmera externa" disabled={monitor.sourceBusy} onPress={() => monitor.selecionarFonte('celular')} />
        <Button title="Webcam do computador servidor" disabled={monitor.sourceBusy} cor="cinzaEscuro" onPress={() => monitor.selecionarFonte('webcam')} />
        <Button title="Vídeo de exemplo" disabled={monitor.sourceBusy} cor="cinzaEscuro" onPress={() => monitor.selecionarFonte('exemplo')} />
        <Button title="Parar captura" disabled={monitor.sourceBusy} cor="cinzaEscuro" onPress={() => monitor.selecionarFonte('stop')} />
        <Button title={monitor.connecting ? 'Conectando…' : 'Conectar câmera'} disabled={monitor.connecting} onPress={monitor.conectar} />
        <Button title="Parar visualização" cor="cinzaEscuro" onPress={monitor.parar} />
        <Button title="Gerenciar câmeras" cor="branco" onPress={() => navigation.navigate('MinhasCameras')} />
      </View>
    </Card>
  </Screen>;
}
