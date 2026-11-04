import { useAppStyles } from '../hooks/useAppStyles';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import { useChatAgendamento } from '../hooks/useChatAgendamento';

export default function ChatAgendamento({ navigation, route }) {
  const { cores, ui, styles } = useAppStyles(createStyles);
  const { user, mensagens, texto, setTexto, carregando, enviando, erro, carregar, confirmou, enviar, souVeterinario } = useChatAgendamento(route.params?.id);
  return (
    <Screen navigation={navigation} title="Conversa do agendamento" subtitle={`Confirme o atendimento de ${route.params?.petNome || 'seu animal'}`} active="home">
      <Card style={styles.confirmCard}>
        <Text style={ui.title}>Confirmar horário</Text>
        <Text style={ui.body}>Tutor e veterinário podem confirmar a consulta por aqui.</Text>
        <View style={styles.confirmRows}>
          <Status label="Responsável" ok={confirmou.responsavel} />
          <Status label="Veterinário" ok={confirmou.veterinario} />
        </View>
        <Button title={souVeterinario ? 'Confirmar que posso atender' : 'Confirmar que posso comparecer'} icon="checkmark-circle-outline" onPress={() => enviar('CONFIRMACAO')} disabled={enviando || (souVeterinario ? confirmou.veterinario : confirmou.responsavel)} />
      </Card>

      <Text style={styles.sectionTitle}>Mensagens</Text>
      {carregando ? <View style={ui.state}><ActivityIndicator size="large" color={cores.marrom} /><Text style={ui.body}>Carregando conversa…</Text></View> : null}
      {!carregando && erro ? <Card><Text style={ui.error}>{erro}</Text><Button title="Tentar novamente" onPress={carregar} /></Card> : null}
      {!carregando && !erro && !mensagens.length ? <Card><Text style={ui.body}>Ainda não há mensagens. Envie uma confirmação ou combine o atendimento.</Text></Card> : null}
      {mensagens.map((item) => <Card key={item.id} style={[styles.messageCard, item.autorId === user?.id && styles.myMessage]}>
        <Text style={styles.author}>{item.autorNome} · {item.autorTipo === 'VETERINARIO' ? 'Veterinário' : 'Responsável'}</Text>
        <Text style={styles.message}>{item.texto}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleString('pt-BR')}</Text>
      </Card>)}

      <Card style={styles.composer}>
        <TextInput value={texto} onChangeText={setTexto} placeholder="Escreva uma mensagem" placeholderTextColor={cores.textoClaro} multiline style={styles.input} editable={!enviando} />
        {erro ? <Text style={ui.error}>{erro}</Text> : null}
        <Button title={enviando ? 'Enviando...' : 'Enviar mensagem'} icon="send-outline" onPress={() => enviar()} disabled={enviando || !texto.trim()} />
      </Card>
    </Screen>
  );
}

function Status({ label, ok }) {
  const { styles } = useAppStyles(createStyles);
  return <View style={styles.status}><Text style={styles.statusLabel}>{label}</Text><Text style={[styles.statusValue, ok ? styles.ok : styles.waiting]}>{ok ? 'Confirmado' : 'Aguardando'}</Text></View>;
}

const createStyles = (cores) => StyleSheet.create({
  confirmCard: { backgroundColor: cores.destaqueSuave, borderColor: '#F4D69A', borderWidth: 1, marginBottom: 18 },
  confirmRows: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  status: { flex: 1, minWidth: 0, backgroundColor: cores.fundoClaro, borderRadius: 12, padding: 12 },
  statusLabel: { color: cores.textoClaro, fontSize: 13, fontWeight: '800' },
  statusValue: { fontSize: 14, fontWeight: '900', marginTop: 4 },
  ok: { color: cores.verde },
  waiting: { color: cores.principalEscuro },
  sectionTitle: { color: cores.marrom, fontSize: 19, fontWeight: '900', marginBottom: 10 },
  messageCard: { marginBottom: 10 },
  myMessage: { backgroundColor: cores.destaqueSuave, borderWidth: 1, borderColor: '#F4D69A' },
  author: { color: cores.principalEscuro, fontSize: 12, fontWeight: '900', marginBottom: 6 },
  message: { color: cores.texto, fontSize: 16, lineHeight: 23 },
  date: { color: cores.textoClaro, fontSize: 12, marginTop: 8 },
  composer: { marginTop: 6, marginBottom: 24 },
  input: { minHeight: 90, borderRadius: 10, backgroundColor: cores.campo, color: cores.texto, padding: 14, fontSize: 16, textAlignVertical: 'top', marginBottom: 12 },
});
