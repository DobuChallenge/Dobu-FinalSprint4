import { Linking, Text, View } from 'react-native';
import Card from './Card';
import Button from './Button';
import QueryState from './QueryState';
import TextInput from './TextInput';
import VacinaForm from './VacinaForm';
import { useAppStyles } from '../hooks/useAppStyles';
import { formatarDataVacina, statusDaVacina } from '../services/informacoes';
import { vaccineGuidance, vaccineSources } from '../data/vaccineGuidance';

export default function CadernoVacinas({ caderno }) {
  const { ui } = useAppStyles();
  return <View>
    <Text style={ui.heading}>Vacinas</Text>
    <TextInput label="Buscar vacina" value={caderno.pesquisaVacina} onChangeText={caderno.setPesquisaVacina} placeholder="Nome da vacina" />
    <QueryState query={caderno.vacinasQuery} empty={Boolean(caderno.vacinasQuery.data && !caderno.vacinasFiltradas.length)} emptyTitle="Nenhuma vacina encontrada" emptyMessage="As vacinas deste animal aparecerão aqui.">
      {caderno.vacinasFiltradas.map(vacina => <Card key={vacina.id}>
        <Text style={ui.title}>{vacina.nome}</Text>
        <Text style={ui.body}>Aplicação: {formatarDataVacina(vacina.dataAplicacao)}</Text>
        <Text style={ui.body}>Próxima dose: {formatarDataVacina(vacina.dataProximaDose)}</Text>
        <Text style={ui.badge}>{statusDaVacina(vacina.dataProximaDose).label}</Text>
      </Card>)}
    </QueryState>
    <VacinaForm petId={caderno.petId} />
    <Card>
      <Text style={ui.title}>Guia de vacinação</Text>
      <Text style={ui.caption}>Referência das diretrizes WSAVA 2024. Confirme o protocolo do seu animal com o veterinário.</Text>
      {vaccineGuidance.map(item => <View key={item.id} style={ui.field}>
        <Text style={ui.label}>{item.species} · {item.title}</Text>
        <Text style={ui.body}>{item.text}</Text>
        <Text style={ui.caption}>{item.note}</Text>
      </View>)}
      <View style={ui.actions}>{vaccineSources.map(source => <Button key={source.url} title={source.label} cor="branco" onPress={() => Linking.openURL(source.url)} />)}</View>
    </Card>
  </View>;
}
