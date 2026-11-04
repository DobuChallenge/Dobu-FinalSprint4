export function dataVacina(value) {
  if (!value) return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) throw new Error('Use DD/MM/AAAA para as datas.');
  const [, d, m, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(m) - 1 || date.getDate() !== Number(d)) throw new Error('Informe uma data válida.');
  return `${y}-${m}-${d}T00:00:00`;
}

export function vacinaPayload(draft, petId) {
  if (!petId) throw new Error('Selecione um animal.');
  const nome = draft.nome.trim();
  if (nome.length < 2) throw new Error('Informe o nome da vacina.');
  const dataAplicacao = dataVacina(draft.dataAplicacao);
  if (!dataAplicacao) throw new Error('Informe a data da aplicação.');
  const dataProximaDose = dataVacina(draft.dataProximaDose);
  if (dataProximaDose && dataProximaDose < dataAplicacao) throw new Error('A próxima dose não pode ser anterior à aplicação.');
  return { nome, petId, dataAplicacao, dataProximaDose };
}
