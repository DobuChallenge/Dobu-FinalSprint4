const INATURALIST_URL = 'https://api.inaturalist.org/v1/taxa';
const GBIF_URL = 'https://api.gbif.org/v1/species/suggest';

export async function buscarTaxaINaturalist(termo) {
  const url = new URL(INATURALIST_URL);
  url.searchParams.set('q', traduzirTermoAnimal(String(termo || '').trim()));
  url.searchParams.set('per_page', '5');
  url.searchParams.set('is_active', 'true');

  const response = await fetch(url.href, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('A base de espécies não respondeu agora.');
  const payload = await response.json();

  return (payload?.results || [])
    .filter((item) => isTaxonAnimal(item))
    .map((item) => ({
    id: `inat-${item.id}`,
    titulo: item.preferred_common_name || item.name || 'Espécie',
    resumo: [item.name, item.observations_count ? `${item.observations_count.toLocaleString('pt-BR')} observações` : ''].filter(Boolean).join(' · '),
    url: item.wikipedia_url || `https://www.inaturalist.org/taxa/${item.id}`,
    imagem: item.default_photo?.medium_url || item.default_photo?.square_url || '',
    fonte: 'iNaturalist · espécies e observações',
    }));
}

function traduzirTermoAnimal(valor) {
  return valor
    .replace(/cães|cão|cachorros?|caninos?/gi, 'dog')
    .replace(/gatos?|felinos?/gi, 'cat')
    .replace(/pássaros?|aves?/gi, 'bird')
    .replace(/coelhos?/gi, 'rabbit');
}

function isTaxonAnimal(item) {
  const grupo = String(item?.iconic_taxon_name || '').toLowerCase();
  return grupo !== 'plantae' && grupo !== 'fungi' && grupo !== 'chromista' && grupo !== 'protozoa';
}

export async function buscarTaxonomiaGbif(termo) {
  const url = new URL(GBIF_URL);
  url.searchParams.set('q', String(termo || '').trim());
  url.searchParams.set('limit', '5');

  const response = await fetch(url.href, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('A taxonomia pública não respondeu agora.');
  const resultados = await response.json();

  return (Array.isArray(resultados) ? resultados : [])
    .filter((item) => !item.kingdom || item.kingdom === 'Animalia')
    .map((item) => ({
      id: `gbif-${item.key || item.scientificName}`,
      titulo: item.vernacularName || item.canonicalName || item.scientificName || 'Táxon animal',
      resumo: [item.scientificName, item.rank, item.kingdom].filter(Boolean).join(' · '),
      url: item.key ? `https://www.gbif.org/species/${item.key}` : 'https://www.gbif.org/species/search',
      fonte: 'GBIF · classificação científica',
    }));
}
