import { useAppStyles } from '../hooks/useAppStyles';
import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, StyleSheet, Text, TextInput as NativeTextInput, View } from 'react-native';

import VacinaForm from '../components/VacinaForm';
import Button from '../components/Button';
import Card from '../components/Card';
import QueryState from '../components/QueryState';
import Screen from '../components/Screen';
import SelectField from '../components/SelectField';
import TextInput from '../components/TextInput';
import { useInformacoesCaderno } from '../hooks/useInformacoes';
import { formatarDataVacina, resumirRaca, statusDaVacina } from '../services/informacoes';
import { vaccineGuidance, vaccineSources } from '../data/vaccineGuidance';

export default function Informacoes({ navigation, route }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  const caderno = useInformacoesCaderno(route?.params?.petId);
  return (
    <Screen navigation={navigation} title="Informações" subtitle="Pesquise raças, cuidados e vacinas" active="home">
      <Text style={styles.sectionTitle}>Pesquisar informações</Text>
      <SearchBox
        label="Buscar raça ou assunto"
        value={caderno.pesquisaRaca}
        onChangeText={caderno.setPesquisaRaca}
        placeholder="Ex.: vacina antirrábica, gato, alimentação"
      />
      <Text style={styles.quickTitle}>Temas para começar</Text>
      <View style={styles.quickTopics}>
        {[
          'Vacinação de cães e gatos',
          'Alimentação de pets',
          'Sinais de alerta em animais',
          'Parasitas em cães e gatos',
        ].map((tema) => (
          <Pressable key={tema} onPress={() => caderno.setPesquisaRaca(tema)} style={styles.quickTopic}>
            <Ionicons name="paw-outline" size={15} color={cores.principalEscuro} />
            <Text style={styles.quickTopicText}>{tema}</Text>
          </Pressable>
        ))}
      </View>

      <QueryState
        query={caderno.catalogosQuery}
        empty={Boolean(caderno.catalogosQuery.data && caderno.racasFiltradas.length === 0)}
        emptyTitle="Nenhuma raça encontrada"
        emptyMessage="Crie a lista inicial de espécies e raças no cadastro de animal ou tente outra busca."
      >
        {caderno.racasFiltradas.slice(0, 8).map((raca) => (
          <BreedCard key={raca.id} raca={raca} />
        ))}
      </QueryState>

      {caderno.pesquisaRaca.trim().length >= 3 ? (
        <View style={styles.publicSearchSection}>
          <View style={styles.publicSearchTitleRow}>
            <Ionicons name="globe-outline" size={20} color={cores.principalEscuro} />
            <Text style={styles.publicSearchTitle}>Resultados de fontes públicas</Text>
          </View>
          <Text style={styles.publicSearchHelp}>Conteúdo aberto para pesquisa inicial. Confirme orientações de saúde com um veterinário.</Text>
          <QueryState
            query={caderno.fontesPublicasQuery}
            empty={Boolean(caderno.fontesPublicasQuery.data && caderno.fontesPublicasQuery.data.length === 0)}
            emptyTitle="Nenhuma fonte encontrada"
            emptyMessage="Tente buscar por outro nome de raça, sintoma ou cuidado."
          >
            {caderno.fontesPublicasQuery.data?.map((fonte) => <PublicSourceCard key={fonte.id} fonte={fonte} />)}
          </QueryState>
          <View style={styles.publicSearchTitleRow}>
            <Ionicons name="flask-outline" size={20} color={cores.principalEscuro} />
            <Text style={styles.publicSearchTitle}>Pesquisas veterinárias</Text>
          </View>
          <Text style={styles.publicSearchHelp}>Artigos científicos relacionados ao tema pesquisado, indexados pelo PubMed.</Text>
          <QueryState
            query={caderno.pesquisasVeterinariasQuery}
            empty={Boolean(caderno.pesquisasVeterinariasQuery.data && caderno.pesquisasVeterinariasQuery.data.length === 0)}
            emptyTitle="Nenhuma pesquisa encontrada"
            emptyMessage="Tente usar termos como dog, cat, vaccination ou veterinary."
          >
            {caderno.pesquisasVeterinariasQuery.data?.map((fonte) => <PublicSourceCard key={fonte.id} fonte={fonte} />)}
          </QueryState>
        </View>
      ) : null}

      {caderno.pesquisaRaca.trim().length >= 3 ? (
        <View style={styles.publicSearchSection}>
          <View style={styles.publicSearchTitleRow}>
            <Ionicons name="earth-outline" size={20} color={cores.principalEscuro} />
            <Text style={styles.publicSearchTitle}>Espécies e biodiversidade</Text>
          </View>
          <Text style={styles.publicSearchHelp}>Nomes comuns, nomes científicos, imagens e classificação de espécies animais.</Text>
          <QueryState
            query={caderno.inaturalistQuery}
            empty={Boolean(caderno.inaturalistQuery.data && caderno.inaturalistQuery.data.length === 0)}
            emptyTitle="Nenhuma espécie encontrada"
            emptyMessage="Experimente buscar pelo nome da raça ou espécie."
          >
            {caderno.inaturalistQuery.data?.map((fonte) => <BiodiversityCard key={fonte.id} fonte={fonte} />)}
          </QueryState>
          <QueryState
            query={caderno.gbifQuery}
            empty={Boolean(caderno.gbifQuery.data && caderno.gbifQuery.data.length === 0)}
            emptyTitle="Nenhuma classificação encontrada"
            emptyMessage="A taxonomia pública não encontrou esse termo."
          >
            {caderno.gbifQuery.data?.map((fonte) => <PublicSourceCard key={fonte.id} fonte={fonte} />)}
          </QueryState>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Vacinas</Text>
      <Card style={styles.guidanceCard}>
        <View style={styles.guidanceHeader}>
          <View style={styles.iconBadge}>
            <Ionicons name="shield-checkmark-outline" size={22} color={cores.principalEscuro} />
          </View>
          <View style={styles.cardTitleArea}>
            <Text style={styles.cardKicker}>Guia de referência</Text>
            <Text style={styles.cardTitle}>O que acompanhar</Text>
          </View>
        </View>
        <Text style={styles.guidanceIntro}>Resumo educativo baseado nas diretrizes WSAVA 2024. O protocolo individual deve ser confirmado com um veterinário.</Text>
        {vaccineGuidance.map((item) => (
          <View key={item.id} style={styles.guidanceItem}>
            <View style={styles.guidanceItemTop}>
              <Text style={styles.guidanceTitle}>{item.title}</Text>
              <Text style={styles.guidanceSpecies}>{item.species}</Text>
            </View>
            <Text style={styles.guidanceText}>{item.text}</Text>
            <Text style={styles.guidanceNote}>{item.note}</Text>
          </View>
        ))}
        <Text style={styles.sourceTitle}>Fontes</Text>
        {vaccineSources.map((source) => (
          <Pressable key={source.url} onPress={() => Linking.openURL(source.url)} accessibilityRole="link" style={styles.sourceLink}>
            <Ionicons name="open-outline" size={16} color={cores.principalEscuro} />
            <Text style={styles.sourceText}>{source.label}</Text>
          </Pressable>
        ))}
      </Card>
      <QueryState
        query={caderno.petsQuery}
        empty={Boolean(caderno.petsQuery.data && caderno.petsQuery.data.length === 0)}
        emptyTitle="Nenhum animal disponível"
        emptyMessage="Cadastre um animal para consultar vacinas vinculadas a ele."
      >
        <SelectField
          label="Animal"
          value={caderno.petId}
          onChange={caderno.setPetId}
          options={caderno.petOptions}
          placeholder="Selecione um animal"
          disabled={caderno.mutations.criar.isPending || caderno.mutations.excluir.isPending}
        />

        <SearchBox
          label="Buscar vacina"
          value={caderno.pesquisaVacina}
          onChangeText={caderno.setPesquisaVacina}
          placeholder="Busque por nome da vacina ou animal"
        />

        <QueryState
          query={caderno.vacinasQuery}
          empty={Boolean(caderno.vacinasQuery.data && caderno.vacinasFiltradas.length === 0)}
          emptyTitle="Nenhuma vacina encontrada"
          emptyMessage="As vacinas cadastradas para seus animais aparecerão aqui."
        >
          {caderno.vacinasFiltradas.map((vacina) => (
            <Card key={vacina.id} style={styles.vaccineCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBadge}>
                  <Ionicons name="medkit-outline" size={22} color={cores.principalEscuro} />
                </View>
                <View style={styles.cardTitleArea}>
                  <Text style={styles.cardKicker}>Vacina</Text>
                  <Text style={styles.cardTitle}>{vacina.nome}</Text>
                </View>
              </View>
              <InfoRow label="Animal" value={vacina.petNome} />
              <InfoRow label="Aplicação" value={formatarDataVacina(vacina.dataAplicacao)} />
              <InfoRow label="Próxima dose" value={formatarDataVacina(vacina.dataProximaDose)} />
              <Text style={[styles.vaccineStatus, statusDaVacina(vacina.dataProximaDose).tipo === 'atrasada' ? styles.vaccineStatusLate : statusDaVacina(vacina.dataProximaDose).tipo === 'proxima' ? styles.vaccineStatusSoon : styles.vaccineStatusOk]}>
                {statusDaVacina(vacina.dataProximaDose).label}
              </Text>
            </Card>
          ))}
        </QueryState>
      </QueryState>

      <VacinaForm petId={caderno.petId} />
      <Button title="Abrir caderno de cuidados" icon="book-outline" onPress={() => navigation.navigate('CadernoCuidados', { petId: caderno.petId })} />

    </Screen>
  );
}

function BreedCard({ raca }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  const details = resumirRaca(raca);
  const description = String(raca.descricao || '').trim();
  const care = String(raca.cuidados || '').trim();

  return (
    <Card style={styles.breedCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBadge}>
          <Ionicons name="paw-outline" size={22} color={cores.principalEscuro} />
        </View>
        <View style={styles.cardTitleArea}>
          <Text style={styles.cardKicker}>Raça</Text>
          <Text style={styles.cardTitle}>{raca.nome}</Text>
        </View>
      </View>
      {details.map((item) => <InfoRow key={item.label} label={item.label} value={item.value} />)}
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {care ? (
        <View style={styles.careBox}>
          <Text style={styles.careTitle}>Cuidados cadastrados</Text>
          <Text style={styles.careText}>{care}</Text>
        </View>
      ) : null}
    </Card>
  );
}

function PublicSourceCard({ fonte }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return (
    <Card style={styles.publicSourceCard}>
      <Text style={styles.cardKicker}>{fonte.fonte}</Text>
      <Text style={styles.publicSourceTitle}>{fonte.titulo}</Text>
      {fonte.resumo ? <Text style={styles.publicSourceText}>{fonte.resumo}</Text> : null}
      <Pressable onPress={() => Linking.openURL(fonte.url)} accessibilityRole="link" style={styles.publicSourceLink}>
        <Text style={styles.publicSourceLinkText}>Abrir fonte</Text>
        <Ionicons name="open-outline" size={16} color={cores.principalEscuro} />
      </Pressable>
    </Card>
  );
}

function BiodiversityCard({ fonte }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return (
    <Card style={styles.publicSourceCard}>
      {fonte.imagem ? <Image source={{ uri: fonte.imagem }} style={styles.biodiversityImage} resizeMode="cover" /> : null}
      <Text style={styles.cardKicker}>{fonte.fonte}</Text>
      <Text style={styles.publicSourceTitle}>{fonte.titulo}</Text>
      {fonte.resumo ? <Text style={styles.publicSourceText}>{fonte.resumo}</Text> : null}
      <Pressable onPress={() => Linking.openURL(fonte.url)} accessibilityRole="link" style={styles.publicSourceLink}>
        <Text style={styles.publicSourceLinkText}>Ver espécie</Text>
        <Ionicons name="open-outline" size={16} color={cores.principalEscuro} />
      </Pressable>
    </Card>
  );
}

function SearchBox({ label, value, onChangeText, placeholder }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return (
    <View style={styles.searchGroup}>
      <Text style={ui.label}>{label}</Text>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={cores.textoClaro} />
        <NativeTextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={cores.textoClaro}
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

function InfoRow({ label, value }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function StateCard({ icon, text }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  return (
    <Card style={styles.stateCard}>
      <Ionicons name={icon} size={26} color={cores.textoClaro} />
      <Text style={styles.stateText}>{text}</Text>
    </Card>
  );
}

const createStyles = (cores) => StyleSheet.create({
  sectionTitle: { color: cores.marrom, fontSize: 19, fontWeight: '900', marginBottom: 10, marginTop: 6 },
  sectionTitleNoMargin: { color: cores.marrom, fontSize: 19, fontWeight: '900' },
  searchGroup: { marginBottom: 14 },
  quickTitle: { color: cores.marrom, fontSize: 14, fontWeight: '900', marginTop: -2, marginBottom: 7 },
  quickTopics: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  quickTopic: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 18, backgroundColor: cores.fundoClaro, paddingHorizontal: 10, paddingVertical: 8 },
  quickTopicText: { color: cores.principalEscuro, fontSize: 12, fontWeight: '800' },
  searchBox: { minHeight: 52, backgroundColor: cores.fundoClaro, borderRadius: 8, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  searchInput: { flex: 1, color: cores.texto, fontSize: 16, marginLeft: 8 },
  publicSearchSection: { marginBottom: 10 },
  publicSearchTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 3, marginBottom: 4 },
  publicSearchTitle: { color: cores.marrom, fontSize: 17, fontWeight: '900' },
  publicSearchHelp: { color: cores.textoClaro, fontSize: 13, lineHeight: 19, marginBottom: 8 },
  publicSourceCard: { marginBottom: 10 },
  biodiversityImage: { width: '100%', height: 130, borderRadius: 10, marginBottom: 10, backgroundColor: cores.fundoClaro },
  publicSourceTitle: { color: cores.marrom, fontSize: 17, fontWeight: '900', marginTop: 5 },
  publicSourceText: { color: cores.texto, fontSize: 14, lineHeight: 21, marginTop: 7 },
  publicSourceLink: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', marginTop: 10 },
  publicSourceLinkText: { color: cores.principalEscuro, fontWeight: '900' },
  breedCard: { marginBottom: 12 },
  vaccineCard: { marginBottom: 12 },
  vaccineFormCard: { marginBottom: 18 },
  formTitle: { color: cores.marrom, fontSize: 18, fontWeight: '900', marginBottom: 6 },
  guidanceCard: { marginBottom: 16 },
  guidanceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  guidanceIntro: { color: cores.texto, fontSize: 14, lineHeight: 21, marginBottom: 6 },
  guidanceItem: { borderTopWidth: 1, borderTopColor: cores.cinza, paddingTop: 11, marginTop: 11 },
  guidanceItemTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center' },
  guidanceTitle: { color: cores.marrom, fontSize: 15, fontWeight: '900', flex: 1 },
  guidanceSpecies: { color: cores.principalEscuro, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  guidanceText: { color: cores.texto, fontSize: 14, lineHeight: 21, marginTop: 5 },
  guidanceNote: { color: cores.textoClaro, fontSize: 12, lineHeight: 18, marginTop: 5, fontStyle: 'italic' },
  sourceTitle: { color: cores.marrom, fontSize: 13, fontWeight: '900', marginTop: 15, marginBottom: 4 },
  sourceLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5 },
  sourceText: { color: cores.principalEscuro, fontSize: 13, fontWeight: '800', flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBadge: { width: 42, height: 42, borderRadius: 21, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  cardTitleArea: { flex: 1 },
  cardKicker: { color: cores.principalEscuro, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  cardTitle: { color: cores.marrom, fontSize: 18, fontWeight: '900', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 5 },
  infoLabel: { color: cores.textoClaro, fontWeight: '800', flex: 1 },
  infoValue: { color: cores.texto, fontWeight: '800', flex: 1.2, textAlign: 'right' },
  description: { color: cores.texto, fontSize: 15, lineHeight: 22, marginTop: 10 },
  careBox: { backgroundColor: cores.fundoClaro, borderRadius: 8, padding: 12, marginTop: 12 },
  careTitle: { color: cores.marrom, fontWeight: '900', marginBottom: 6 },
  careText: { color: cores.texto, fontSize: 15, lineHeight: 22 },
  cadernoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12, marginBottom: 10 },
  smallButton: { minHeight: 44, paddingHorizontal: 16 },
  petContext: { color: cores.textoClaro, fontWeight: '800', marginBottom: 10 },
  noteCard: { marginBottom: 12 },
  vaccineStatus: { alignSelf: 'flex-start', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, fontSize: 12, fontWeight: '900', marginTop: 9 },
  vaccineStatusOk: { color: '#2E6B32', backgroundColor: '#E7F7EA' },
  vaccineStatusSoon: { color: '#9A641D', backgroundColor: '#FFF0D1' },
  vaccineStatusLate: { color: '#A23A3A', backgroundColor: '#FFE5E5' },
  noteTop: { flexDirection: 'row', alignItems: 'flex-start' },
  noteTitleArea: { flex: 1, paddingRight: 8 },
  noteText: { color: cores.texto, fontSize: 16, lineHeight: 24, marginTop: 10 },
  deleteButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1F1', borderWidth: 1, borderColor: '#F6C7C7', alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
  formCard: { marginBottom: 24 },
  formHelp: { color: cores.textoClaro, fontSize: 15, lineHeight: 22, marginBottom: 18 },
  success: { color: '#2E6B32', fontSize: 15, fontWeight: '800', lineHeight: 22, marginBottom: 14 },
  stateCard: { alignItems: 'center', marginBottom: 22, paddingVertical: 22 },
  stateText: { color: cores.textoClaro, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8 },
});
