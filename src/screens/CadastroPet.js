import { useAppStyles } from '../hooks/useAppStyles';
import { useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import PhotoPicker from '../components/PhotoPicker';
import QueryState from '../components/QueryState';
import Screen from '../components/Screen';
import SelectField from '../components/SelectField';
import TextInput from '../components/TextInput';
import { useAuth } from '../hooks/useAuth';
import { usePetForm } from '../hooks/usePetForm';
import { useCatalogoBasicoMutation, useCatalogos, usePet, usePetMutations } from '../hooks/usePets';

export default function CadastroPet({ navigation, route }) {
  const { cores, ui, estilos, styles } = useAppStyles(createStyles);
  const id = route.params?.id;
  const editing = Boolean(id);
  const { user } = useAuth();
  const petQuery = usePet(id);
  const catalogosQuery = useCatalogos();
  const catalogoBasico = useCatalogoBasicoMutation();
  const { salvar } = usePetMutations();

  const handleSaved = useCallback((savedPet) => {
    const savedId = savedPet?.id || id;
    if (savedId) navigation.replace('PerfilPet', { id: savedId });
    else navigation.replace('ListaPets');
  }, [id, navigation]);

  const form = usePetForm({
    id,
    pet: petQuery.data,
    catalogos: catalogosQuery.data,
    user,
    savePet: salvar.mutateAsync,
    onSaved: handleSaved,
  });

  const catalogoVazio = Boolean(catalogosQuery.data && (!catalogosQuery.data.especies?.length || !catalogosQuery.data.racas?.length));

  const formContent = (
    <QueryState query={catalogosQuery}>
      {catalogoVazio ? (
        <Card>
          <Text style={ui.title}>Catálogo de espécies e raças</Text>
          <Text style={ui.body}>A lista ainda está vazia. Crie as opções iniciais para cadastrar seu animal.</Text>
          {catalogoBasico.isError ? <Text accessibilityRole="alert" style={ui.error}>{catalogoBasico.error?.message || 'Não foi possível criar as opções agora.'}</Text> : null}
          <Button
            title={catalogoBasico.isPending ? 'Preparando opções...' : 'Criar lista inicial'}
            icon="paw-outline"
            cor="cinzaEscuro"
            onPress={catalogoBasico.isPending ? undefined : () => catalogoBasico.mutate(catalogosQuery.data)}
            disabled={catalogoBasico.isPending}
          />
        </Card>
      ) : (
        <Card style={styles.formCard}>
          <PhotoPicker
            photo={form.draft.foto}
            onChangePhoto={(value) => form.setField('foto', value)}
            title="Foto do animal"
            type="pet"
            disabled={form.isSubmitting}
          />
          <TextInput
            label="Nome do animal"
            value={form.draft.nome}
            onChangeText={(value) => form.setField('nome', value)}
            placeholder="Ex.: Lua"
            editable={!form.isSubmitting}
          />
          <TextInput
            label="Idade em anos"
            value={form.draft.idade}
            onChangeText={(value) => form.setField('idade', value)}
            placeholder="Ex.: 0"
            keyboardType="number-pad"
            editable={!form.isSubmitting}
          />
          <SelectField
            label="Espécie"
            value={form.draft.especieId}
            onChange={(value) => form.setField('especieId', value)}
            options={form.speciesOptions}
            placeholder="Selecione a espécie"
            disabled={form.isSubmitting}
          />
          <SelectField
            label="Raça"
            value={form.draft.racaId}
            onChange={(value) => form.setField('racaId', value)}
            options={form.breedOptions}
            placeholder={form.draft.especieId ? 'Selecione a raça' : 'Selecione a espécie primeiro'}
            disabled={!form.draft.especieId || form.isSubmitting}
          />
          <SelectField
            label="Responsável"
            value={form.draft.responsavelId}
            onChange={(value) => form.setField('responsavelId', value)}
            options={form.ownerOptions}
            placeholder="Selecione o responsável"
            disabled={user?.tipoConta !== 'veterinario' || form.isSubmitting}
          />

          {user?.tipoConta === 'veterinario' && form.ownerOptions.length === 0 ? (
            <Text accessibilityRole="alert" style={ui.error}>Cadastre um responsável antes de continuar.</Text>
          ) : null}
          {form.error ? <Text accessibilityRole="alert" style={ui.error}>{form.error}</Text> : null}

          <Button
            title={form.isSubmitting ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar animal'}
            icon={editing ? 'checkmark-circle-outline' : 'add-circle-outline'}
            cor="cinzaEscuro"
            onPress={form.submit}
            disabled={form.isSubmitting}
          />
        </Card>
      )}
    </QueryState>
  );

  return (
    <Screen
      navigation={navigation}
      title={editing ? 'Editar animal' : 'Cadastrar animal'}
      subtitle={editing ? 'Atualize os dados do perfil' : 'Organize os dados do seu animal'}
      active="home"
    >
      {editing ? <QueryState query={petQuery}>{formContent}</QueryState> : formContent}
    </Screen>
  );
}

const createStyles = (cores) => StyleSheet.create({
  formCard: {
    backgroundColor: cores.principal,
    borderRadius: 18,
    paddingVertical: 22,
  },
});
