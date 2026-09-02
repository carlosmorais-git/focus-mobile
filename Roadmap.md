# 🎯 Roadmap — App FOCO

Plano de saída do estado "projeto de curso" para produto mantível.
Seis fases, ordenadas por dependência: cada uma destrava a seguinte.

Todo item aponta o arquivo onde está a evidência. Nada aqui é palpite — foi levantado
por leitura do código depois da migração para Expo SDK 57.

---

## 📍 Estado atual

| | |
|---|---|
| **Upgrade** | SDK 53 → 57 · RN 0.79 → 0.86.3 · React 19.2.3 · expo-router 57 |
| **Estrutura** | Migrada para `src/` (app, components, context, hooks, assets) |
| **Bundle** | Desbloqueado — `@react-navigation/*` removido do código e do `package.json` |
| **expo-doctor** | 18/21 na última execução, antes do `--fix` final |

Estimativas de tempo são para uma pessoa sozinha. Servem para **ordenar**, não para prometer prazo.

---

## Fase 0 — Fechar o upgrade

> 🔴 **Bloqueia tudo** · ~1 h

Nada mais entra enquanto o tree estiver desalinhado. Sem isso, todo bug novo é ambíguo:
código ou versão?

- [ ] **Alinhar as devDependencies** — duas saltam de major
      `eslint-config-expo` 9.2.0 → `~57.0.2` · `typescript` 5.8.3 → `~6.0.3` · `@babel/core` → `^7.29.0` · `@types/react` → `~19.2.4`
      Risco baixo: o projeto é JS puro, o TypeScript só serve o alias `@/*` e os tipos de rota.
- [ ] **Subir os cinco patches pendentes**
      `expo-constants` · `expo-font` · `expo-image` · `expo-linking` · `expo-router`
- [ ] **Rodar em aparelho, não só bundlar** — 🔴 não pulável
      Bundle verde não prova nada sobre módulo nativo. Reanimated 4 + `react-native-worklets` 0.10.1
      com `newArchEnabled: true` só falham em runtime.
- [ ] **Subir o `.nvmrc` de 20 para 22**
      O arquivo pede Node 20; o RN 0.86 exige 20.19+. Quem clonar seguindo o `.nvmrc` pega versão de fronteira.
- [ ] **`npx expo-doctor` fechando 21/21**

---

## Fase 1 — Enxugar

> 🟢 **Risco baixo** · ~2 h

Só remoção e renomeação. É o que mais muda a impressão de profissionalismo por hora gasta,
e limpa o terreno para as fases seguintes.

- [ ] **Decidir um padrão único para os hooks de contexto** — ⚠️ divergência iminente
      Os três providers exportam o hook inline como `default`, **e** os três arquivos separados
      continuam existindo com o mesmo hook. Todos os consumidores importam do arquivo separado,
      então a cópia inline é código morto esperando divergir do original.
      `src/context/tarefas/ProvedorTarefas.jsx:98` vs `useContextoTarefa.js:4`
      `src/context/notificacao/ProvedorNotificacao.jsx` vs `useContextoNotificacao.js`
      `src/context/modal/ProvedorModal.jsx` vs `useModal.jsx`
- [ ] **Corrigir a mensagem de erro copiada**
      O hook de notificação lança `"useContextoTarefa deve ser usado dentro do ProvedorNotificacao"`.
      Nome errado, em dois arquivos. Quem cair nesse erro vai procurar no lugar errado.
      `src/context/notificacao/useContextoNotificacao.js:9` · `ProvedorNotificacao.jsx:78`
- [ ] **Remover as dez dependências mortas** (tabela no fim deste arquivo)
- [ ] **Tirar `src/app/dialog_pagina/` da rota de produção**
      Tela de teste de modais e toasts empacotada com o app. Está oculta das abas por `href: null`,
      mas continua no bundle e alcançável por deep link.
- [ ] **Trocar o rodapé de template**
      Todas as telas assinam "Desenvolvido por Alura" — marca do curso original, não do projeto.
      `src/components/Footer/index.jsx`
- [ ] **Parar de engolir falha de gravação** — ⚠️ perda de dado
      O `catch` do `storeData` está vazio. Se o AsyncStorage falhar, a tarefa some no próximo boot
      e ninguém fica sabendo.
      `src/context/tarefas/ProvedorTarefas.jsx`
- [ ] **Apagar o `todo.md`**
      Todas as fases marcadas como concluídas e aponta para um `RELATORIO_FINALIZACAO.md` inexistente.
- [ ] **Atualizar o roadmap do README**
      Lista "Persistência de dados (AsyncStorage)" como pendente. Está implementada desde sempre,
      na chave `foco-tarefas`.

---

## Fase 2 — Tema centralizado

> ~3 h

Pré-requisito honesto para qualquer mudança visual. Hoje, trocar o roxo do app significa
caçar o mesmo hex em quinze arquivos.

- [ ] **Criar `src/theme/` e matar o arquivo vazio**
      `src/assets/style.jsx` tem zero bytes desde o primeiro commit. Cada `StyleSheet.create`
      repete `#021123`, `#B872FF`, `#144480` e `#98A0A8` na mão.
- [ ] **Extrair escala de espaçamento e raio**
      Números soltos por toda parte: `flex: 0.95` na lista, `bottom: 103` no botão animado,
      `borderRadius: 32` repetido. Viram tokens.
      `src/app/tarefas/index.jsx` · `src/components/DigitarTarefa/index.jsx`
- [ ] **Resolver a promessa de tema automático**
      `app.json` declara `userInterfaceStyle: "automatic"`, mas o app é escuro fixo.
      Ou entrega o tema claro, ou trava em `"dark"` e para de prometer.

---

## Fase 3 — Consertar o Pomodoro

> 🔴 **É o produto** · ~6 h

O cronômetro é metade do motivo do app existir e é a parte menos robusta do código.
Quatro problemas independentes, um deles silencioso.

- [ ] **Formatar o tempo sem `Date`** — 🔴 bug latente
      O display converte segundos para `new Date(segundo * 1000)` e chama `toLocaleTimeString`.
      Isso lê o fuso do aparelho. Funciona no Brasil só porque o offset é de horas inteiras —
      em Índia (+5:30) ou Terra Nova (−3:30) o minuto sai errado. E qualquer sessão de 60 min
      ou mais estoura o campo de minutos. Trocar por aritmética pura.
      `src/components/Tempo/index.jsx:5-14`
- [ ] **Tirar o efeito colateral de dentro do updater** — ⚠️ React 19
      `limpar()` é chamado dentro do callback de `setSegundo`. Updater tem que ser puro —
      o StrictMode do React 19 invoca duas vezes e o `clearInterval` roda em duplicidade.
      `src/app/pomodoro.jsx`
- [ ] **Contar por timestamp, não por tick**
      `setInterval` de 1 s acumula desvio e congela quando o app vai para segundo plano.
      Guardar o instante-alvo e derivar o restante do relógio resolve os dois de uma vez.
- [ ] **Avisar quando a sessão termina**
      Hoje o tempo zera e volta ao valor inicial em silêncio. Sem som, sem vibração, sem notificação —
      quem trocou de app não fica sabendo. `expo-haptics` já está instalado e sem uso.
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
      Nenhum `accessibilityLabel`, `accessibilityRole` ou `accessible` em todo o `src/`.
      Os botões de concluir e excluir são `Pressable` com ícone SVG e nenhum texto —
      leitor de tela não anuncia nada.
- [ ] **CI no GitHub Actions** — lint e teste a cada push. Hoje nada roda sozinho.
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

## 🧹 As dez dependências mortas

Nenhuma aparece em nenhum `import` dentro de `src/`. Verificado por varredura no diretório inteiro.

| Pacote | Situação |
|---|---|
| `react-native-keyboard-aware-scroll-view` | Abandonado, sem suporte à New Architecture. **Remover primeiro.** |
| `react-native-vector-icons` | Redundante — o app usa `@expo/vector-icons`. |
| `uuid` | Instalado e nunca importado. Candidato a uso na fase 4. |
| `react-native-uuid` | Segunda biblioteca para o mesmo fim. Escolher uma. |
| `expo-blur` | Sem uso. |
| `expo-haptics` | Sem uso — mas é exatamente o que falta na fase 3. |
| `expo-image` | Sem uso, e o `expo install --fix` ainda registrou o config plugin no `app.json`. |
| `expo-symbols` | Sem uso. |
| `expo-web-browser` | Sem uso. |
| `expo-status-bar` | Sem uso — a barra nunca é configurada em tela nenhuma. |
