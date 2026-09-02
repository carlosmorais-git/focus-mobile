/**
 * Tokens de design do app FOCO.
 *
 * Fonte única das cores, espaçamentos, raios e tamanhos de fonte. Antes disso
 * cada `StyleSheet.create` repetia os mesmos hex na mão — trocar o roxo do app
 * significava caçar `#B872FF` em quinze arquivos, e duas grafias do mesmo roxo
 * (`#B872FF` e `#b872ff`) já tinham escapado.
 *
 * O app é escuro fixo: `app.json` declara `userInterfaceStyle: "dark"`.
 * Se um dia entrar tema claro, o caminho é transformar `cores` num mapa
 * `{ dark, light }` e ler com `useColorScheme()` — os nomes dos tokens
 * continuam valendo.
 */

export const cores = {
  // Base
  fundo: "#021123", // fundo de todas as telas
  destaque: "#B872FF", // roxo da marca: botões, aba ativa, bordas de destaque
  borda: "#144480", // azul das bordas, cards e do modal
  texto: "#fff",
  textoSecundario: "#98A0A8", // rodapé, aba inativa, texto de apoio
  textoSobreClaro: "#021123", // texto e ícones sobre fundo claro (botão roxo, input)

  // Superfícies translúcidas
  painel: "rgba(20, 68, 128, 0.5)", // painel de ações do pomodoro
  overlay: "rgba(2, 17, 35, 0.8)", // fundo por trás do modal
  bordaSutil: "rgba(255,255,255,0.1)", // contorno do card de tarefa

  // Estados
  desabilitado: "rgba(114, 114, 114, 0.88)", // borda e texto de botão inativo
  placeholder: "#999",
  textoVazio: "#aaa", // mensagem de lista sem tarefas
  campo: "#fff", // fundo do input de texto
  textoCampo: "#000",
  iconeInativo: "rgb(178, 179, 180)", // ícone do botão salvar desabilitado

  // Tarefa
  tarefaPendente: "#98A0A8", // fundo do card antes de concluir
  tarefaConcluida: "#0f725c", // fundo do card depois de concluir
  check: "#00F4BF", // círculo do ícone de concluída
  checkVazio: "white",

  // Ações do modal
  perigo: "#dc3545",
  perigoBorda: "#c82333",
  perigoFundo: "rgba(220, 53, 69, 0.1)", // fundo do botão de excluir no card
  sucesso: "#28a745",
  sucessoBorda: "#1e7e34",

  sombra: "#000",
};

/** Escala de espaçamento. Usar sempre um degrau, não um número solto. */
export const espaco = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  gigante: 40,
};

/** Raios de canto. */
export const raio = {
  sm: 8,
  md: 12,
  lg: 20,
  pilula: 32, // botões arredondados e o painel de ações
};

/** Tamanhos de fonte. */
export const fonte = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 22,
  titulo: 26,
  cronometro: 50,
};

/** Sombras prontas, em `boxShadow` (os props `shadow*` são depreciados). */
export const sombra = {
  card: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  botao: "0px 2px 4px rgba(0, 0, 0, 0.3)",
  modal: "0px 8px 15px rgba(0, 0, 0, 0.4)",
};
