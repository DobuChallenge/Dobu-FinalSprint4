import { Text, View } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import CameraPreview from '../components/CameraPreview';
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
      <Text style={ui.badge}>{markers.frozen ? 'Imagem pausada' : monitor.imageReady ? 'Conectada' : monitor.urls || monitor.sourceBusy ? 'Sincronizando…' : 'Aguardando câmera'}</Text>
      <CameraPreview
        colors={cores}
        imageUri={markers.frozen || monitor.frame}
        streamUri={markers.frozen ? '' : monitor.stream}
        imageReady={Boolean(markers.frozen || monitor.imageReady)}
        message="Sincronizando câmera…"
        areas={markers.areas}
        handlers={markers.handlers}
        onLayout={(event) => markers.setSize(event.nativeEvent.layout)}
        onLoad={(uri) => { if (!markers.frozen) monitor.imagemCarregada(uri); }}
        onError={(uri) => { if (!markers.frozen) monitor.imagemFalhou(uri); }}
      />
      <View style={ui.actions}>
        <Button title="Atualizar imagem" disabled={!monitor.urls || !!markers.frozen} cor="cinzaEscuro" onPress={monitor.atualizarImagem} />
        <Button title="Marcar pote de comida" disabled={!monitor.imageReady && !markers.frozen} onPress={() => markers.marcar('food', markers.frozen || monitor.loadedFrame)} />
        <Button title="Marcar pote de água" disabled={!monitor.imageReady && !markers.frozen} onPress={() => markers.marcar('water', markers.frozen || monitor.loadedFrame)} />
        {!!markers.selected && <Text style={ui.caption}>Arraste um retângulo na imagem congelada.</Text>}
        <Button title="Salvar marcações" disabled={!monitor.urls || markers.saving} onPress={markers.salvar} />
        {!!markers.frozen && <Button title="Retomar câmera" cor="cinzaEscuro" onPress={markers.retomar} />}
        {!!markers.error && <Text style={ui.error}>{markers.error}</Text>}
      </View>
      <Text style={ui.body}>Presença: {!monitor.reading?.online ? 'Aguardando leitura' : monitor.reading.presente ? 'Animal identificado' : 'Sem animal identificado'}</Text>
      <Text style={ui.body}>Movimento: {!monitor.reading?.online ? 'Aguardando leitura' : !monitor.reading.presente ? 'Aguardando animal' : monitor.reading.movimento ? 'Em movimento' : 'Pouco movimento'}</Text>
      {!!monitor.reading?.especie && <Text style={ui.caption}>Animal: {monitor.reading.especie}</Text>}
      <Text style={ui.caption}>A observação da rotina não substitui a avaliação veterinária.</Text>
      {monitor.reading?.descanso && <Text style={ui.body}>Possível descanso: pouca atividade por mais de uma hora.</Text>}
      {!!monitor.error && <Text style={ui.error}>{monitor.error}</Text>}
    </Card>
    <Card>
      <Text style={ui.title}>Alimentação e hidratação</Text>
      {['food', 'water'].map(kind => {
        const bowl = monitor.reading?.bowls?.[kind];
        const configured = markers.saved && !!markers.areas[kind];
        return <View key={kind} style={ui.actions}>
          <Text style={ui.label}>{kind === 'water' ? 'Pote de água' : 'Pote de comida'}</Text>
          <Text style={ui.body}>{!configured ? 'Marque o pote e salve para ativar a análise.' : !monitor.reading?.online ? 'Aguardando câmera e leitura do animal.' : !bowl ? 'O serviço de câmera precisa ser atualizado para analisar os potes.' : bowl.active ? 'Animal observado junto ao pote.' : 'Análise ativa. Aguardando aproximação do animal.'}</Text>
          {configured && bowl?.configured && <Text style={ui.caption}>{bowl.count === 1 ? '1 possível evento' : `${bowl.count} possíveis eventos`} de {kind === 'water' ? 'hidratação' : 'alimentação'} nesta captura.{bowl.last_event_at ? ` Último: ${new Date(bowl.last_event_at).toLocaleString('pt-BR')}.` : ''}</Text>}
        </View>;
      })}
      <Text style={ui.caption}>A permanência junto ao pote indica uma possível interação; não confirma a quantidade consumida.</Text>
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
      <Text style={ui.title}>Conectar câmera</Text>
      <Text style={ui.caption}>Use uma câmera externa pelo IP ou a webcam do computador que executa a Dobu-Cam.</Text>
      <TextInput label="Endereço da Dobu-Cam" placeholder="http://IP-DO-SERVIDOR:5000" value={monitor.endpoint} onChangeText={monitor.setEndpoint} keyboardType="url" editable={monitor.settingsReady && !monitor.sourceBusy} />
      <TextInput label="IP ou endereço da câmera externa" placeholder="192.168.15.5:8080" value={monitor.externalUrl} onChangeText={monitor.setExternalUrl} keyboardType="url" editable={monitor.settingsReady && !monitor.sourceBusy} />
      {!!monitor.settingsError && <Text style={ui.error}>{monitor.settingsError}</Text>}
      <View style={ui.actions}>
        <Button title={!monitor.settingsReady ? 'Carregando endereço…' : monitor.sourceBusy ? 'Conectando…' : 'Ligar câmera externa'} disabled={monitor.sourceBusy || !monitor.settingsReady} onPress={monitor.conectar} />
        <Button title="Usar webcam do computador" cor="cinzaEscuro" disabled={monitor.sourceBusy || !monitor.settingsReady} onPress={monitor.conectarWebcam} />
        <Button title="Gerenciar câmeras" cor="branco" onPress={() => navigation.navigate('MinhasCameras')} />
      </View>
    </Card>
  </Screen>;
}
