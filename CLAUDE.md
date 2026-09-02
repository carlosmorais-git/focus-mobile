# CLAUDE.md — Contexto do App FOCO

Guia para agentes de IA trabalhando neste repositório.

## O que é

App mobile de produtividade: **timer Pomodoro** + **gerenciador de tarefas**.
React Native 0.86 + Expo SDK 57 + expo-router 57 + React 19.2. JavaScript (`.jsx`), não TypeScript.
Nova arquitetura ligada (`newArchEnabled: true`).
Idioma do código: **português** (variáveis, funções, componentes, comentários).

## Estrutura (tudo em `src/`)

```
src/
├── app/                    # rotas expo-router (file-based routing)
│   ├── _layout.jsx         # raiz: providers + Stack
│   ├── index.jsx           # tela inicial (splash/onboarding)
│   ├── (tabs)/             # grupo: as abas, uma tela do Stack
│   │   ├── _layout.jsx     # Bottom Tabs
│   │   ├── pomodoro.jsx    # aba "Foco" — timer
│   │   └── tarefas/index.jsx
│   ├── add_tarefa/index.jsx
│   └── edit_tarefa/[id].jsx
├── components/             # cada componente = pasta com index.jsx
├── context/                # Context API: um par Provedor + hook por domínio
├── hooks/
└── assets/                 # imagens, fontes, prints em Designer/
```

Raiz só tem config: `app.json`, `tsconfig.json`, `eslint.config.js`, `package.json`.
expo-router detecta `src/app/` automaticamente (SDK 50+). Não existe pasta `app/` na raiz — não recriar.

## Navegação

**Stack na raiz, Tabs dentro dele.**

[_layout.jsx](src/app/_layout.jsx) é um `<Stack>`. O grupo `(tabs)` é UMA tela dessa pilha,
com [seu próprio `<Tabs>`](src/app/(tabs)/_layout.jsx) (`expo-router/js-tabs`).
`add_tarefa` e `edit_tarefa` empilham por cima e ganham voltar nativo.

Parênteses em `(tabs)` marcam grupo de rotas: não entram na URL.
As rotas continuam `/pomodoro` e `/tarefas` — não renomear para `/(tabs)/...`.

O voltar é o nativo do Stack — não interceptar. Existia um `VoltaRoteador` que cancelava
o `beforeRemove` e forçava `/tarefas`; foi apagado. Ele fazia sentido quando tudo era Tabs
e nada empilhava, mas com Stack qualquer interceptação de `beforeRemove` que navegue
dentro do próprio listener entra em laço: navegar remove a tela, remover dispara
`beforeRemove` de novo. `add_tarefa` e `edit_tarefa` só são alcançadas a partir de
`/tarefas`, então desempilhar já volta para o lugar certo.

## Estado

Dois Contexts, aninhados nesta ordem em `_layout.jsx` (dados → interface):

| Contexto | Arquivo | Hook | Responsabilidade |
|---|---|---|---|
| Tarefas | [ProvedorTarefas.jsx](src/context/tarefas/ProvedorTarefas.jsx) | `useContextoTarefa` | CRUD + persistência |
| Modal | [ProvedorModal.jsx](src/context/modal/ProvedorModal.jsx) | `useModal` | confirmação (Promise) + loading |

**Um arquivo por domínio.** O provedor é `export` nomeado, o hook é o `export default`
do mesmo arquivo — não existe arquivo separado só para o hook.

```js
import { ProvedorTarefas } from "../context/tarefas/ProvedorTarefas"; // provedor
import useContextoTarefa from "../context/tarefas/ProvedorTarefas";   // hook
```

Cada hook lança erro se usado fora do provedor. Sem Redux/Zustand — não introduzir sem pedir.

Já existiram `useContextoTarefa.js` e `useModal.jsx` separados, duplicando o hook que
também estava inline no provedor. Os separados foram apagados. Não recriar: um domínio,
um arquivo.

**Persistência:** AsyncStorage, chave `foco-tarefas`. Salva automaticamente em `useEffect` sobre `tarefas`, protegido por flag `isLoaded` (evita gravar array vazio antes do load inicial).

**Tarefa:** `{ id: number, descricao: string, completed: boolean }`. `id` = `Date.now() + random(1000)`.

**Modal de confirmação** retorna Promise: `const ok = await confirmar({ titulo, mensagem })`.

O contexto de tarefas expõe `erroPersistencia`: a última falha de gravação no AsyncStorage,
ou `null`. Nenhuma tela lê ainda. O `catch` não pode voltar a ser vazio — sem isso a tarefa
some no próximo boot em silêncio.

Não existe sistema de toast/notificação — modal é a única superfície de feedback.
Foi removido de propósito; não reintroduzir sem pedido explícito.

## Componentes globais

`<ModalGlobal />` fica montado em `_layout.jsx`, fora das `Tabs` — sempre presente, controlado só por contexto.

## Estilo

`StyleSheet.create` local em cada arquivo, mas os **valores vêm de [src/theme/](src/theme/index.js)**.
Nenhuma cor, espaçamento, raio ou tamanho de fonte literal fora desse arquivo — se precisar de um
valor novo, adicione um token; não escreva o hex no `StyleSheet`.

```js
import { cores, espaco, fonte, raio, sombra } from "@/theme";

backgroundColor: cores.fundo,
padding: espaco.lg,
borderRadius: raio.pilula,
```

| Token | Valor | Uso |
|---|---|---|
| `cores.fundo` | `#021123` | fundo de todas as telas |
| `cores.destaque` | `#B872FF` | roxo da marca, aba ativa |
| `cores.borda` | `#144480` | bordas, cards, fundo do modal |
| `cores.textoSecundario` | `#98A0A8` | rodapé, aba inativa |
| `cores.texto` | `#fff` | texto primário |
| `cores.textoSobreClaro` | `#021123` | texto e ícone sobre fundo claro |

App é **escuro fixo**: `app.json` declara `userInterfaceStyle: "dark"`.
Para abrir tema claro, transformar `cores` num mapa `{ dark, light }` e ler com
`useColorScheme()` — os nomes dos tokens continuam valendo.

Animações: `Animated` da RN core. `react-native-reanimated` foi removido — não reinstalar sem pedir.

Sombras usam `boxShadow` (string CSS), não os props `shadow*`, que estão depreciados e
disparam warning no react-native-web. `elevation` continua para o Android.

`resizeMode` vai como prop do `<Image>`, nunca dentro do objeto de `style`.

## Valores animados

Use [useValorAnimado](src/hooks/useValorAnimado.js), não `useRef(new Animated.Value(x)).current`
— ler um ref durante o render é erro da regra `react-hooks/refs`.
A RN expõe `useAnimatedValue` com o mesmo propósito, mas o `react-native-web` não reexporta
esse hook, então a versão local existe para o app funcionar no web.

O valor é estável entre renders, então pode (e deve) entrar nos arrays de dependência.

## Imports

Relativos (`../../components/...`) na maior parte. Alias `@/*` → `src/*` configurado em `tsconfig.json` e usado em um ponto ([index.jsx](src/app/index.jsx)). Preferir `@/` em código novo.

## Comandos

```bash
npm start          # expo start
npm run android
npm run ios
npm run web
npm run lint       # expo lint — deve ficar em zero, sem erro nem warning
npx expo start -c  # limpar cache do Metro (usar após mover arquivos)

npm run android:usb     # espera device, cria túnel adb, abre com --localhost
npm run adb:reverse     # só o túnel: adb reverse tcp:8081 tcp:8081
npm run adb:devices     # adb devices -l

npm run release:patch   # 1.0.0 -> 1.0.1
npm run release:minor   # 1.0.0 -> 1.1.0
npm run release:major   # 1.0.0 -> 2.0.0
```

### Rodar por cabo USB

`android:usb` serve para desenvolver sem Wi-Fi (ou em rede que bloqueia a porta do Metro).
A flag `--localhost` é essencial: sem ela o Expo serve pelo IP da LAN e o `adb reverse` fica inútil.

O túnel cai quando o cabo desconecta — rodar `npm run adb:reverse` de novo.
`adb devices` mostrando `unauthorized` significa popup de depuração USB pendente no celular.

## Versionamento

A versão vive em **dois** lugares: `package.json` e `app.json` (`expo.version`).
Nunca editar à mão — usar os scripts `release:*`, que envolvem `npm version`.

O hook `version` do npm dispara [scripts/sync-app-version.js](scripts/sync-app-version.js)
entre o bump e o commit, então o `app.json` entra no mesmo commit e na mesma tag.
O script também incrementa `android.versionCode` (inteiro, exigido pela Play Store)
e espelha `ios.buildNumber`.

`npm version` exige árvore do git limpa.

## Pendências conhecidas

- `icon`, `favicon` e `splash` do `app.json` apontam todos para `adaptive-icon.png` (225x225). Expo recomenda **1024x1024** para o ícone — gerar assets dedicados antes de publicar.
- Sem testes automatizados.
- `expo-haptics` e `react-native-uuid` estão instalados e ainda sem uso: são reserva
  declarada para itens de "Conhecido e adiado" no [Roadmap.md](Roadmap.md).
  Não remover como "dependência morta".
- `react-native-worklets` é peer de `expo-modules-core` e `@expo/ui`. Não remover.

## Convenções

- Nomes em português, componentes em PascalCase, pastas de componente com `index.jsx`.
- Não converter para TypeScript sem pedido explícito.
- Não mover arquivos para fora de `src/` — estrutura `src/` é preferência do dono do repo.
- Prettier não é ferramenta do projeto (não há config nem dependência) — não rodar, ele
  reformata com trailing commas que não batem com o estilo existente.
