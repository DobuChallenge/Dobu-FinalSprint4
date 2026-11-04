const WIKIMEDIA_SEARCH_URL = 'https://pt.wikipedia.org/w/rest.php/v1/search/page';

export async function buscarFontesPublicas(termo) {
  const busca = String(termo || '').trim();
  if (busca.length < 3) return [];

  const consultaAnimal = /animal|cachorro|cao|cão|gato|pet|filhote|cão|felino|canino|vacina|alimentação|alimentacao|parasita|veterin/i.test(busca)
    ? busca
    : `${busca} animais domésticos`;
  const url = new URL(WIKIMEDIA_SEARCH_URL);
  url.searchParams.set('q', consultaAnimal);
  url.searchParams.set('limit', '6');

  const response = await fetch(url.href, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('A fonte pública não respondeu agora.');

  const payload = await response.json();
  return (Array.isArray(payload?.pages) ? payload.pages : []).map((page) => ({
    id: String(page.id || page.key || page.title),
    titulo: page.title || page.key || 'Artigo sem título',
    resumo: limparHtml(page.excerpt || page.description || 'Informação pública relacionada à busca.'),
    url: page.key ? `https://pt.wikipedia.org/wiki/${encodeURIComponent(page.key).replace(/%2F/g, '/')}` : 'https://pt.wikipedia.org',
    fonte: 'Wikipédia em português',
  }));
}

function limparHtml(valor) {
  return String(valor || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}
