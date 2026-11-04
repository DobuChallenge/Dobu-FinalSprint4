import { useAppStyles } from '../hooks/useAppStyles';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput as NativeTextInput, View } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import CadernoVacinas from '../components/CadernoVacinas';
import QueryState from '../components/QueryState';
import Screen from '../components/Screen';
import SelectField from '../components/SelectField';
import TextInput from '../components/TextInput';
import { useAuth } from '../hooks/useAuth';
import { useInformacaoForm, useInformacoesCaderno } from '../hooks/useInformacoes';

export default function CadernoCuidados({ navigation, route }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  const { user } = useAuth();
  const caderno = useInformacoesCaderno(route?.params?.petId);
  const form = useInformacaoForm(caderno.petId, caderno.mutations.criar);
  const podeEditar = Boolean(user);

  return (
    <Screen navigation={navigation} title="Caderno de cuidados" subtitle="Vacinas e anotações do seu animal" active="home">
      <Card style={styles.introCard}>
        <View style={styles.introHeader}>
          <View style={styles.iconBadge}><Ionicons name="book-outline" size={22} color={cores.principalEscuro} /></View>
          <View style={styles.introCopy}>
            <Text style={ui.title}>Anotações do acompanhamento</Text>
            <Text style={ui.body}>Guarde vacinas, orientações do veterinário e observações da rotina.</Text>
          </View>
        </View>
        {!podeEditar ? <Text style={styles.readOnly}>Você está visualizando as orientações registradas pelo veterinário.</Text> : null}
      </Card>

      <QueryState
        query={caderno.petsQuery}
        empty={Boolean(caderno.petsQuery.data && caderno.petsQuery.data.length === 0)}
        emptyTitle="Nenhum animal disponível"
        emptyMessage="Cadastre ou vincule um animal para consultar o caderno de cuidados."
      >
        <SelectField
          label="Animal"
          value={caderno.petId}
          onChange={caderno.setPetId}
          options={caderno.petOptions}
          placeholder="Selecione um animal"
        />
        <View style={styles.cadernoHeader}>
          <Text style={styles.sectionTitle}>Registros de {caderno.pet?.nome || 'animal selecionado'}</Text>
          <Button
            title="Agendar"
            icon="calendar-outline"
            cor="branco"
            disabled={!caderno.petId}
            onPress={() => navigation.navigate('AdicionarAgendamento', { petId: caderno.petId })}
            style={styles.smallButton}
          />
        </View>
        <CadernoVacinas caderno={caderno} />
        <SearchBox label="Buscar no caderno" value={caderno.pesquisa} onChangeText={caderno.setPesquisa} placeholder="Buscar por título ou descrição" />

        <QueryState
          query={caderno.informacoesQuery}
          empty={Boolean(caderno.informacoesQuery.data && caderno.informacoes.length === 0)}
          emptyTitle="Nenhum registro neste caderno"
          emptyMessage={podeEditar ? 'Use o formulário abaixo para registrar uma observação.' : 'Quando o veterinário registrar uma orientação, ela aparecerá aqui.'}
        >
          {caderno.informacoesFiltradas.length === 0 ? (
            <StateCard icon="search-outline" text="Nenhum registro corresponde à busca." />
          ) : caderno.informacoesFiltradas.map((informacao) => (
            <Card key={informacao.id} style={styles.noteCard}>
              <View style={styles.noteTop}>
                <View style={styles.noteTitleArea}>
                  <Text style={styles.cardKicker}>Registro de cuidado</Text>
                  <Text style={styles.cardTitle}>{informacao.titulo}</Text>
                </View>
                {podeEditar ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir ${informacao.titulo || 'registro'}`}
                    accessibilityState={{ disabled: caderno.mutations.excluir.isPending }}
                    disabled={caderno.mutations.excluir.isPending}
                    onPress={() => caderno.confirmarExclusao(informacao)}
                    style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
                  >
                    {caderno.mutations.excluir.isPending && caderno.mutations.excluir.variables?.id === informacao.id
                      ? <ActivityIndicator size="small" color={cores.vermelho} />
                      : <Ionicons name="trash-outline" size={20} color={cores.vermelho} />}
                  </Pressable>
                ) : null}
              </View>
              <Text style={styles.noteText}>{informacao.descricao}</Text>
            </Card>
          ))}
        </QueryState>

        {podeEditar && caderno.mutations.excluir.isError ? <Text accessibilityRole="alert" style={ui.error}>{caderno.mutations.excluir.error?.message || 'Não foi possível excluir o registro.'}</Text> : null}

        {podeEditar ? (
          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>Registrar cuidado</Text>
            <Text style={styles.formHelp}>Adicione uma orientação ou observação importante sobre {caderno.pet?.nome || 'este animal'}.</Text>
            <TextInput label="Título" value={form.titulo} onChangeText={form.setTitulo} placeholder="Ex.: Alimentação" editable={!form.isSubmitting} />
            {form.erros.titulo ? <Text accessibilityRole="alert" style={ui.error}>{form.erros.titulo}</Text> : null}
            <TextInput label="Descrição" value={form.descricao} onChangeText={form.setDescricao} placeholder="Escreva a orientação do cuidado" multiline editable={!form.isSubmitting} />
            {form.erros.descricao ? <Text accessibilityRole="alert" style={ui.error}>{form.erros.descricao}</Text> : null}
            {form.error ? <Text accessibilityRole="alert" style={ui.error}>{form.error}</Text> : null}
            {form.success ? <Text accessibilityLiveRegion="polite" style={styles.success}>{form.success}</Text> : null}
            <Button title={form.isSubmitting ? 'Salvando...' : 'Adicionar registro'} icon={form.isSubmitting ? undefined : 'add-circle-outline'} disabled={form.isSubmitting || !caderno.petId} onPress={form.salvar} />
          </Card>
        ) : null}
      </QueryState>
    </Screen>
  );
}

function SearchBox({ label, value, onChangeText, placeholder }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return <View style={styles.searchGroup}>
    <Text style={ui.label}>{label}</Text>
    <View style={styles.searchBox}>
      <Ionicons name="search-outline" size={21} color={cores.textoClaro} />
      <NativeTextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={cores.textoClaro} style={styles.searchInput} />
    </View>
  </View>;
}

function StateCard({ icon, text }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return <Card style={styles.stateCard}><Ionicons name={icon} size={26} color={cores.textoClaro} /><Text style={styles.stateText}>{text}</Text></Card>;
}

const createStyles = (cores) => StyleSheet.create({
  introCard: { backgroundColor: cores.destaqueSuave, borderColor: '#F4D69A', borderWidth: 1, marginBottom: 18 },
  introHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  iconBadge: { width: 42, height: 42, borderRadius: 21, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'center' },
  introCopy: { flex: 1 },
  readOnly: { color: cores.textoClaro, fontSize: 13, lineHeight: 19, marginTop: 12 },
  cadernoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 2, marginBottom: 10 },
  sectionTitle: { color: cores.marrom, fontSize: 19, fontWeight: '900', flex: 1 },
  smallButton: { minHeight: 44, paddingHorizontal: 16 },
  searchGroup: { marginBottom: 14 },
  searchBox: { minHeight: 52, backgroundColor: cores.fundoClaro, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  searchInput: { flex: 1, color: cores.texto, fontSize: 16, marginLeft: 8 },
  noteCard: { marginBottom: 12 },
  noteTop: { flexDirection: 'row', alignItems: 'flex-start' },
  noteTitleArea: { flex: 1, paddingRight: 8 },
  cardKicker: { color: cores.principalEscuro, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  cardTitle: { color: cores.marrom, fontSize: 18, fontWeight: '900', marginTop: 2 },
  noteText: { color: cores.texto, fontSize: 16, lineHeight: 24, marginTop: 10 },
  deleteButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1F1', borderWidth: 1, borderColor: '#F6C7C7', alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
  formCard: { backgroundColor: cores.destaqueSuave, borderColor: '#F4D69A', borderWidth: 1, marginTop: 8, marginBottom: 24 },
  formTitle: { color: cores.marrom, fontSize: 18, fontWeight: '900', marginBottom: 6 },
  formHelp: { color: cores.textoClaro, fontSize: 15, lineHeight: 22, marginBottom: 18 },
  success: { color: '#2E6B32', fontSize: 15, fontWeight: '800', lineHeight: 22, marginBottom: 14 },
  stateCard: { alignItems: 'center', marginBottom: 22, paddingVertical: 22 },
  stateText: { color: cores.textoClaro, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8 },
});
