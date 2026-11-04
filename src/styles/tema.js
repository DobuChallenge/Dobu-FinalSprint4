export const cores = {
  fundo: '#F1F1F1',
  fundoClaro: '#FFFFFF',
  principal: '#FFB84D',
  principalEscuro: '#F2A33A',
  marrom: '#6C6C6C',
  texto: '#54504C',
  textoClaro: '#8B8580',
  branco: '#FFFFFF',
  cinza: '#DDD8D2',
  cinzaEscuro: '#858585',
  buttonGray: '#7F7F7F',
  areia: '#C7B0A7',
  amareloClaro: '#FFD394',
  verde: '#4CAF50',
  vermelho: '#E85D5D',
};

export const espacamentos = {
  tela: 24,
  card: 20,
};

export const paletas = {
  light: { ...cores, destaqueSuave: '#FFF7E8', campo: '#F6F1EC', erroSuave: '#FFF0EE', textoSecundario: '#69645F' },
  dark: {
    ...cores, fundo: '#181818', fundoClaro: '#252525', marrom: '#E8E4E0', texto: '#F1EDE9',
    textoClaro: '#C4BCB5', cinza: '#514C48', areia: '#62534D', amareloClaro: '#624523',
    principal: '#BA6B0D', principalEscuro: '#FFD394', verde: '#8EDA91', vermelho: '#FF9D9D',
    destaqueSuave: '#352A1F', campo: '#302D2A', erroSuave: '#472B2B', textoSecundario: '#D0C8C1',
  },
};
