export const vaccineGuidance = [
  {
    id: 'dog-core',
    species: 'Cães',
    title: 'Vacinas essenciais',
    text: 'A proteção contra cinomose, adenovírus e parvovirose é considerada essencial para cães. A antirrábica e a leptospirose devem ser avaliadas conforme a região, legislação e risco de exposição.',
    note: 'A sigla V8/V10 varia conforme o produto e não substitui o nome dos agentes protegidos.',
  },
  {
    id: 'cat-core',
    species: 'Gatos',
    title: 'Vacinas essenciais',
    text: 'Para gatos, a base costuma proteger contra panleucopenia, calicivírus e herpesvírus felino. A vacina contra FeLV pode ser indicada conforme idade, acesso à rua e convivência com outros gatos.',
    note: 'O veterinário deve definir o protocolo de acordo com o estilo de vida e a região.',
  },
  {
    id: 'schedule',
    species: 'Para todos',
    title: 'Como acompanhar',
    text: 'Filhotes normalmente precisam de uma série inicial de doses e reforços. Adultos podem ter intervalos diferentes conforme a vacina, o produto e a avaliação do veterinário.',
    note: 'Não aplique, antecipe ou repita uma dose apenas com base neste resumo.',
  },
];

export const vaccineSources = [
  { label: 'WSAVA · Diretrizes globais 2024', url: 'https://wsava.org/Global-Guidelines/Vaccination-Guidelines/' },
  { label: 'AAHA · Diretrizes caninas', url: 'https://www.aaha.org/resources/2022-aaha-canine-vaccination-guidelines/' },
];
