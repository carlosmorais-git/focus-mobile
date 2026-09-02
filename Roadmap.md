# 🎯 Roadmap — App FOCO

**Escopo: portfólio.** O app existe para ser lido por outra pessoa, não para rodar em
produção. Isso decide o que entra e o que fica documentado sem ser feito — robustez que
só aparece depois de semanas de uso real não paga o custo aqui.

Cada item aponta o arquivo onde está a evidência. Nada é palpite — foi levantado por
leitura do código.

Última verificação: **2026-09-02**, branch `dev-2.0`.

---

## 📍 Estado atual

| | |
|---|---|
| **Upgrade** | SDK 53 → 57 · RN 0.79 → 0.86.3 · React 19.2.3 · expo-router 57 |
| **Linguagem** | TypeScript com `strict: true`, `tsc --noEmit` em zero |
| **Estrutura** | `src/` (app, components, context, hooks, theme, types, assets) |
| **Navegação** | Stack na raiz, abas como primeira tela da pilha |
| **Lint** | ✅ zero erro, zero warning |
| **expo-doctor** | ✅ 21/21 |
| **Tema** | centralizado em `src/theme/`, escuro fixo |
| **Dependências** | 21 diretas, nenhuma sem uso além das duas reservadas |
| **Testes** | ❌ nenhum |

## ✅ Fechado em 2026-09-02

Levantado item a item contra o código; não é lista de intenção.

| O que | Evidência | Commit |
|---|---|---|
| devDependencies alinhadas | `eslint-config-expo` ~57.0.2 · `typescript` ~6.0.3 · `@babel/core` ^7.29.0 · `@types/react` ~19.2.4 | `ec59697` |
| `dialog_pagina` fora do bundle | pasta apagada, `Tabs.Screen` removida | `1cf686a` |
| Sistema de toast removido | `context/notificacao/` e `NotificacaoGlobal/` apagados; modal é a única superfície de feedback | `1cf686a` |
| Mensagem de erro copiada | resolvida junto — o arquivo que a continha deixou de existir | `1cf686a` |
| Lint zerado | 38 erros + 19 warnings → 0. `useValorAnimado` no lugar de `useRef(new Animated.Value())` | `4038a8f` |
| Warnings do console web | `boxShadow` no lugar de `shadow*`, `resizeMode` como prop, `!!` no render condicional | `6f76344` |
| `SafeAreaView` do core | migrado para `react-native-safe-area-context` + `SafeAreaProvider` na raiz | `c1891c9` |
| Rodar em aparelho | Android por cabo USB, `npm run android:usb` | `c8751b8` |
| Stack por cima das Tabs | grupo `(tabs)` com layout próprio; add/edit empilham com voltar nativo | `ec285a5` |
| `VoltaRoteador` apagado | interceptar `beforeRemove` e navegar dentro do listener causa laço infinito com Stack | `f627321` |
| Chamadas de rota alinhadas à pilha | `back()` ao salvar, `push()` com caminho absoluto ao abrir | `e22c8e7` |
| **Fase 0** — `app.json` no schema do SDK 57 | `newArchEnabled` e `android.edgeToEdgeEnabled` apagados; `expo-doctor` 21/21 | não commitado |
| **Fase 0** — `.nvmrc` 20 → 22 | RN 0.86 exige Node 20.19+ | não commitado |
| **Fase 1** — hooks de contexto sem duplicata | um arquivo por domínio: provedor como `export` nomeado, hook como `export default` do mesmo arquivo | não commitado |
| **Fase 1** — nove dependências mortas fora | `expo-image` também saiu dos `plugins` do `app.json` | não commitado |
| **Fase 1** — rodapé sem marca do curso | linha "Desenvolvido por Alura" removida | não commitado |
| **Fase 1** — falha de gravação deixa de ser silenciosa | `console.error` + `erroPersistencia` no contexto | não commitado |
| **Fase 1** — `todo.md` apagado | apontava para um relatório inexistente | não commitado |
| **Fase 1** — roadmap do README corrigido | AsyncStorage marcado como pronto, com link para este arquivo | não commitado |
| **Fase 2** — tokens de design | `src/theme/index.js` com `cores`, `espaco`, `raio`, `fonte`, `sombra`; `src/assets/style.jsx` apagado | não commitado |
| **Fase 2** — literais eliminados | zero hex, rgba, espaçamento ou fonte solta fora de `src/theme/` | não commitado |
| **Fase 2** — promessa de tema resolvida | `userInterfaceStyle` de `automatic` para `dark` | não commitado |
| Ícone em 1024×1024 | `logo.png` no lugar de `adaptive-icon.png`, nas 4 referências do `app.json` | `df40080` |
| Migração para TypeScript | 20 arquivos de `src/` em `.ts`/`.tsx`, `strict: true`, script `typecheck` | não commitado |

---

## Fases 0, 1, 1.5 e 2 — fechadas

Detalhe na tabela acima. As pontas que sobraram viraram itens da lista abaixo.

Duas decisões que ficaram registradas para não voltarem como dúvida:

- **Três números seguem fora da escala de tokens, de propósito** — `flex: 0.95` na lista,
  `paddingTop: 50` e `height: 266` no pomodoro, `height: 120` na tab bar. São medidas de
  uma tela só; virar token seria indireção sem ganho. Se aparecerem de novo, aí sim.
- **A splash continua sendo a rota raiz** — `index.jsx:29` usa `router.replace("/pomodoro")`,
  que a descarta corretamente da pilha. Todo cold start passa por ela; é o comportamento
  pretendido, não um resto da migração.

---

## O que ainda vale fazer

Ordenado pelo que um leitor do repositório percebe primeiro.

- [ ] **Separar os três assets do ícone**
      `icon`, `favicon` e `splash` apontam todos para o mesmo `logo.png`. O tamanho agora
      está certo (1024×1024), mas splash e favicon pedem recortes diferentes do ícone.
      `app.json`
- [ ] **Acessibilidade** — 🔴 zero hoje
      Zero ocorrências de `accessibilityLabel`, `accessibilityRole` ou `accessible` no `src/`.
      Os botões de concluir e excluir são `Pressable` com ícone SVG e nenhum texto: leitor de
      tela não anuncia nada. Barato de corrigir e é sinal técnico visível.
- [ ] **CI no GitHub Actions**
      Lint e build a cada push. O badge verde no README diz mais que qualquer parágrafo, e
      hoje o lint só está zerado porque foi rodado à mão.
- [ ] **Dar destino ao `erroPersistencia`**
      O contexto de tarefas expõe a última falha de gravação, mas nenhuma tela lê.
      `src/context/tarefas/ProvedorTarefas.jsx`
- [ ] **Entregar o tema claro**
      Transformar `cores` num mapa `{ dark, light }` + `useColorScheme()`.
      `src/theme/index.js`

---

## Conhecido e adiado

Levantado por leitura do código e **deliberadamente não corrigido**: são defeitos que só
mordem em uso prolongado ou fora do Brasil. Ficam aqui para não serem redescobertos como
novidade — e porque saber que existem vale mais que consertar.

### Cronômetro

- **Fuso vaza no formato do tempo** — `src/components/Tempo/index.jsx:5-14`
  Converte segundos para `new Date(segundo * 1000)` e chama `toLocaleTimeString`, que lê o
  fuso do aparelho. Só funciona onde o offset é de horas inteiras: na Índia (+5:30) ou em
  Terra Nova (−3:30) o minuto sai errado. Sessão de 60 min ou mais estoura o campo.
- **Efeito colateral dentro do updater** — `src/app/(tabs)/pomodoro.jsx:47`
  `limpar()` roda dentro do callback de `setSegundo`. Updater tem que ser puro; o StrictMode
  do React 19 invoca duas vezes e o `clearInterval` duplica.
- **Conta por tick, não por timestamp**
  `setInterval` de 1 s acumula desvio e congela em segundo plano.
- **Termina em silêncio** — sem som, vibração ou notificação. `expo-haptics` está instalado
  justamente para isso e segue sem uso.
- **Sem encadear modos nem contar ciclos** — é o ciclo que dá sentido à técnica.
- **25/5/15 fixos** no array `valueDic`.

### Dados

- **Gerador de id colide** — `Date.now() + Math.floor(Math.random() * 1000)` repete se duas
  tarefas nascerem no mesmo milissegundo com o mesmo sorteio, e esse id é chave de rota em
  `edit_tarefa/[id]`. `react-native-uuid` está instalado para quando isso importar.
- **Sem versão de schema no AsyncStorage** — a chave `foco-tarefas` guarda o array cru;
  mudar o formato quebra a base antiga em silêncio.
- **Sem ErrorBoundary** — exceção de render derruba para tela branca. `expo-router` já expõe um.
- **Sem testes** — nenhum. O alvo natural seriam as funções do contexto de tarefas e a
  formatação de tempo, que é lógica pura.

---

## 🧹 Dependências

Nove removidas em 2026-09-02. Duas ficaram de propósito.

| Pacote | Destino |
|---|---|
| `expo-haptics` | **mantido** — é o que faria o cronômetro avisar o fim da sessão, hoje em "Conhecido e adiado" |
| `react-native-uuid` | **mantido** — vira o gerador de id quando a colisão importar, hoje em "Conhecido e adiado" |
| `react-native-keyboard-aware-scroll-view` | removido — abandonado, sem New Architecture |
| `react-native-vector-icons` | removido — redundante com `@expo/vector-icons` |
| `react-native-reanimated` | removido — todas as animações são do `Animated` da RN core |
| `uuid` | removido — segunda biblioteca para o mesmo fim, ficou a outra |
| `expo-blur` · `expo-symbols` · `expo-web-browser` · `expo-status-bar` | removidos — sem uso |
| `expo-image` | removido, junto com o config plugin órfão no `app.json` |

`react-native-worklets` **continua** e não é lixo: é peer de `expo-modules-core` e de
`@expo/ui` (que o `expo-router` puxa), não do reanimated. Não remover.
