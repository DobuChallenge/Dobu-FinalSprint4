const EUTILS_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export async function buscarPesquisasVeterinarias(termo) {
  const busca = String(termo || '').trim();
  if (busca.length < 3) return [];

  const searchUrl = new URL(`${EUTILS_URL}/esearch.fcgi`);
  searchUrl.searchParams.set('db', 'pubmed');
  const contextoEmIngles = `${busca} ${termosRelacionados(busca)}`.trim();
  searchUrl.searchParams.set('term', `(${contextoEmIngles}) AND (veterinary OR animal OR dog OR cat OR pet)`);
  searchUrl.searchParams.set('retmode', 'json');
  searchUrl.searchParams.set('retmax', '5');

  const searchResponse = await fetch(searchUrl.href, { headers: { Accept: 'application/json' } });
  if (!searchResponse.ok) throw new Error('A base científica não respondeu agora.');
  const searchPayload = await searchResponse.json();
  const ids = searchPayload?.esearchresult?.idlist || [];
  if (!ids.length) return [];

  const summaryUrl = new URL(`${EUTILS_URL}/esummary.fcgi`);
  summaryUrl.searchParams.set('db', 'pubmed');
  summaryUrl.searchParams.set('id', ids.join(','));
  summaryUrl.searchParams.set('retmode', 'json');
  summaryUrl.searchParams.set('version', '2.0');

  const summaryResponse = await fetch(summaryUrl.href, { headers: { Accept: 'application/json' } });
  if (!summaryResponse.ok) throw new Error('Não foi possível carregar os resumos científicos.');
  const summaryPayload = await summaryResponse.json();
  const result = summaryPayload?.result || {};

  return ids.map((id) => result[id]).filter(Boolean).map((item) => ({
    id: `pubmed-${item.uid}`,
    titulo: item.title || 'Pesquisa veterinária',
    resumo: [item.pubdate, item.fulljournalname].filter(Boolean).join(' · '),
    url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`,
    fonte: 'PubMed · pesquisa científica',
  }));
}

function termosRelacionados(valor) {
  const texto = String(valor || '').toLowerCase();
  const termos = [];
  if (texto.includes('vacina') || texto.includes('vacinação')) termos.push('vaccination vaccine');
  if (texto.includes('cão') || texto.includes('cachorro') || texto.includes('cães')) termos.push('dog dogs canine');
  if (texto.includes('gato') || texto.includes('gatos')) termos.push('cat cats feline');
  if (texto.includes('aliment')) termos.push('feeding nutrition diet');
  if (texto.includes('parasita')) termos.push('parasite parasitic');
  if (texto.includes('alerta') || texto.includes('sintoma')) termos.push('clinical signs symptoms');
  return termos.join(' ');
}
