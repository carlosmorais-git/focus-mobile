# 🎯 Roadmap — App FOCO

Plano de saída do estado "projeto de curso" para produto mantível.
Cada item aponta o arquivo onde está a evidência. Nada aqui é palpite — foi levantado
por leitura do código.

Última verificação: **2026-09-02**, branch `dev-2.0`.

---

## 📍 Estado atual

| | |
|---|---|
| **Upgrade** | SDK 53 → 57 · RN 0.79 → 0.86.3 · React 19.2.3 · expo-router 57 |
| **Estrutura** | `src/` (app, components, context, hooks, assets) |
| **Navegação** | Stack na raiz, abas como primeira tela da pilha |
| **Lint** | ✅ zero erro, zero warning |
| **expo-doctor** | 20/21 — falta só o schema do `app.json` |
| **Testes** | ❌ nenhum |

Estimativas de tempo são para uma pessoa sozinha. Servem para **ordenar**, não para prometer prazo.

---

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

---

## Fase 0 — Fechar o upgrade

> 🔴 **Bloqueia tudo** · ~30 min

- [ ] **Limpar o `app.json`** — é o único check que o `expo-doctor` ainda reprova

      should NOT have additional property 'newArchEnabled'.
      Field: android - should NOT have additional property 'edgeToEdgeEnabled'.

      No SDK 57 os dois viraram padrão e saíram do schema. Só apagar as duas chaves.
- [ ] **Subir o `.nvmrc` de 20 para 22**
      O arquivo pede Node 20; o RN 0.86 exige 20.19+. Quem clonar seguindo o `.nvmrc` pega versão de fronteira.
- [ ] **`npx expo-doctor` fechando 21/21**

---

## Fase 1 — Enxugar

> 🟢 **Risco baixo** · ~1 h 30

- [ ] **Decidir um padrão único para os hooks de contexto** — ⚠️ divergência iminente
      Os dois providers exportam o hook inline como `default`, **e** os dois arquivos separados
      continuam existindo com o mesmo hook. Todos os consumidores importam do arquivo separado,
      então a cópia inline é código morto esperando divergir.
      `src/context/tarefas/ProvedorTarefas.jsx:98` vs `useContextoTarefa.js:4`
      `src/context/modal/ProvedorModal.jsx:61` vs `useModal.jsx:4`
- [ ] **Remover as onze dependências mortas** (tabela no fim deste arquivo)
- [ ] **Trocar o rodapé de template**
      Todas as telas assinam "Desenvolvido por Alura" — marca do curso original, não do projeto.
      `src/components/Footer/index.jsx:10`
- [ ] **Parar de engolir falha de gravação** — ⚠️ perda de dado
      O `catch` do `storeData` continua vazio (só ganhou `_e` para calar o lint).
      Se o AsyncStorage falhar, a tarefa some no próximo boot e ninguém fica sabendo.
      `src/context/tarefas/ProvedorTarefas.jsx:28`
- [ ] **Apagar o `todo.md`**
      Todas as fases marcadas como concluídas e aponta para um `RELATORIO_FINALIZACAO.md` inexistente.
- [ ] **Atualizar o roadmap do README**
      `README.md:126` lista "Persistência de dados (AsyncStorage)" como pendente.
      Está implementada desde sempre, na chave `foco-tarefas`.

---

## Fase 1.5 — Terminar a migração de navegação

> 🟡 Aberta pela mudança para Stack · ~1 h

A troca de Tabs para Stack fechou a estrutura, mas deixou pontas soltas em quem
navegava assumindo que tudo era irmão.

- [ ] **Trocar `router.navigate("../tarefas")` por `router.back()`**
      Sobrou de quando não havia pilha. Hoje empurra rota em vez de desempilhar.
      `src/app/add_tarefa/index.jsx:50` · `src/app/edit_tarefa/[id].jsx:64`
- [ ] **Conferir o voltar físico do Android em aparelho**
      Sem o interceptador global, o comportamento agora é o nativo do Stack. Precisa de
      teste manual: pilha `/` → abas → add_tarefa, voltando de cada ponto.
- [ ] **Decidir o que a tela inicial faz na pilha**
      `index.jsx:29` usa `router.replace("/pomodoro")`, que descarta a splash — correto.
      Mas ela continua sendo a rota raiz, então todo cold start passa por ela.

---

## Fase 2 — Tema centralizado

> ~3 h

Pré-requisito honesto para qualquer mudança visual. Hoje, trocar o roxo do app significa
caçar o mesmo hex em quinze arquivos.

- [ ] **Criar `src/theme/` e matar o arquivo vazio**
      `src/assets/style.jsx` tem zero bytes desde o primeiro commit. Cada `StyleSheet.create`
      repete `#021123`, `#B872FF`, `#144480` e `#98A0A8` na mão — agora inclusive no
      `(tabs)/_layout.jsx`.
- [ ] **Extrair escala de espaçamento e raio**
      Números soltos por toda parte: `flex: 0.95` na lista, `bottom: 103` no botão animado,
      `borderRadius: 32` repetido, `height: 120` na tab bar. Viram tokens.
- [ ] **Resolver a promessa de tema automático**
      `app.json` declara `userInterfaceStyle: "automatic"`, mas o app é escuro fixo.
      Ou entrega o tema claro, ou trava em `"dark"` e para de prometer.

---

## Fase 3 — Consertar o Pomodoro

> 🔴 **É o produto** · ~6 h

O cronômetro é metade do motivo do app existir e é a parte menos robusta do código.
Nada aqui foi tocado ainda.

- [ ] **Formatar o tempo sem `Date`** — 🔴 bug latente
      O display converte segundos para `new Date(segundo * 1000)` e chama `toLocaleTimeString`.
      Isso lê o fuso do aparelho. Funciona no Brasil só porque o offset é de horas inteiras —
      em Índia (+5:30) ou Terra Nova (−3:30) o minuto sai errado. E qualquer sessão de 60 min
      ou mais estoura o campo de minutos. Trocar por aritmética pura.
      `src/components/Tempo/index.jsx:5-14`
- [ ] **Tirar o efeito colateral de dentro do updater** — ⚠️ React 19
      `limpar()` é chamado dentro do callback de `setSegundo`. Updater tem que ser puro —
      o StrictMode do React 19 invoca duas vezes e o `clearInterval` roda em duplicidade.
      `src/app/(tabs)/pomodoro.jsx:47`
- [ ] **Contar por timestamp, não por tick**
      `setInterval` de 1 s acumula desvio e congela quando o app vai para segundo plano.
      Guardar o instante-alvo e derivar o restante do relógio resolve os dois de uma vez.
- [ ] **Avisar quando a sessão termina**
      Hoje o tempo zera e volta ao valor inicial em silêncio. Sem som, sem vibração, sem notificação —
      quem trocou de app não fica sabendo. `expo-haptics` já está instalado e sem uso.
      ⚠️ O sistema de toast foi removido: o aviso tem que ser háptico, sonoro ou notificação
      de sistema, não um banner in-app.
- [ ] **Encadear os modos e contar ciclos**
      Foco não avança sozinho para pausa, e nada conta quantos pomodoros saíram.
      É o ciclo que dá sentido à técnica.
- [ ] **Tornar 25/5/15 configurável**
      Os tempos são literais no array `valueDic`. Já está listado como pergunta no FAQ do README.

---

## Fase 4 — Dados e robustez

> ~4 h

Persistência local sem rede de segurança. Os defeitos aqui não aparecem em teste manual —
aparecem no aparelho do usuário, depois de semanas de uso.

- [ ] **Trocar o gerador de id**
      `Date.now() + Math.floor(Math.random() * 1000)` colide se duas tarefas nascerem no mesmo
      milissegundo com o mesmo sorteio. E esse id vira chave de rota na edição (`edit_tarefa/[id]`).
      `uuid` e `react-native-uuid` já estão no `package.json`, ambos sem uso — escolher um.
      `src/context/tarefas/ProvedorTarefas.jsx` — `addTarefa`
- [ ] **Versionar o schema no AsyncStorage**
      A chave `foco-tarefas` guarda o array cru. Quando o formato da tarefa mudar,
      a base antiga entra sem migração e quebra em silêncio.
- [ ] **Montar um ErrorBoundary**
      Qualquer exceção de render derruba o app para tela branca. `expo-router` já expõe `ErrorBoundary`.

---

## Fase 5 — Profissionalizar

> ~8 h

O que separa um repo de portfólio de um repo que dá para outra pessoa manter.
Depende das fases anteriores: não vale escrever teste para código que vai mudar na fase 3.

- [ ] **Primeira suíte de testes** — 🔴 zero hoje
      Começar pelo que tem lógica pura e regressão cara: as funções do contexto de tarefas
      e a formatação de tempo. `jest-expo` + `@testing-library/react-native`.
- [ ] **Acessibilidade** — 🔴 zero hoje
      Zero ocorrências de `accessibilityLabel`, `accessibilityRole` ou `accessible` em todo o `src/`.
      Os botões de concluir e excluir são `Pressable` com ícone SVG e nenhum texto —
      leitor de tela não anuncia nada.
- [ ] **CI no GitHub Actions** — lint e build a cada push. Hoje nada roda sozinho,
      e o lint só está zerado porque foi rodado à mão.
- [ ] **Gerar os ícones de verdade**
      `icon`, `favicon` e `splash` apontam todos para o mesmo `adaptive-icon.png` de 225×225.
      A Expo pede 1024×1024 — hoje só não quebra porque nada foi publicado.

---

## Fase 6 — Melhorias

> A definir

Espaço para as ideias novas. Cada uma entra aqui e depois é realocada para a fase
onde realmente cabe, respeitando dependências.

- [ ] _(a preencher)_

---

## 🧹 As onze dependências mortas

Nenhuma aparece em nenhum `import` dentro de `src/`. Verificado por varredura no diretório inteiro em 2026-09-02.

| Pacote | Situação |
|---|---|
| `react-native-keyboard-aware-scroll-view` | Abandonado, sem suporte à New Architecture. **Remover primeiro.** |
| `react-native-vector-icons` | Redundante — o app usa `@expo/vector-icons`. |
| `react-native-reanimated` | Sem uso. Todas as animações são do `Animated` da RN core. Puxa o `react-native-worklets` junto. |
| `uuid` | Instalado e nunca importado. Candidato a uso na fase 4. |
| `react-native-uuid` | Segunda biblioteca para o mesmo fim. Escolher uma. |
| `expo-blur` | Sem uso. |
| `expo-haptics` | Sem uso — mas é exatamente o que falta na fase 3. |
| `expo-image` | Sem uso, e o `expo install --fix` ainda registrou o config plugin no `app.json`. |
| `expo-symbols` | Sem uso. |
| `expo-web-browser` | Sem uso. |
| `expo-status-bar` | Sem uso — a barra nunca é configurada em tela nenhuma. |
