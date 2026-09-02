# CLAUDE.md — Contexto do App FOCO

Guia para agentes de IA trabalhando neste repositório.

## O que é

App mobile de produtividade: **timer Pomodoro** + **gerenciador de tarefas**.
React Native 0.79 + Expo SDK 53 + expo-router 5. JavaScript (`.jsx`), não TypeScript.
Idioma do código: **português** (variáveis, funções, componentes, comentários).

## Estrutura (tudo em `src/`)

```
src/
├── app/                    # rotas expo-router (file-based routing)
│   ├── _layout.jsx         # raiz: providers + Bottom Tabs
│   ├── index.jsx           # tela inicial (splash/onboarding)
│   ├── pomodoro.jsx        # aba "Foco" — timer
│   ├── tarefas/index.jsx   # aba "Tarefas" — lista
│   ├── add_tarefa/index.jsx
│   ├── edit_tarefa/[id].jsx
│   └── dialog_pagina/index.jsx  # tela de teste de modais/notificações
├── components/             # cada componente = pasta com index.jsx
├── context/                # Context API: um par Provedor + hook por domínio
├── hooks/
└── assets/                 # imagens, fontes, prints em Designer/
```

Raiz só tem config: `app.json`, `tsconfig.json`, `eslint.config.js`, `package.json`.
expo-router detecta `src/app/` automaticamente (SDK 50+). Não existe pasta `app/` na raiz — não recriar.

## Navegação

`Tabs` do expo-router em [_layout.jsx](src/app/_layout.jsx).
Só 2 abas visíveis: **Foco** (`pomodoro`) e **Tarefas** (`tarefas/index`).
Demais telas ficam ocultas via `href: null` nas `Tabs.Screen`.
`index` esconde a tab bar (`tabBarStyle: { display: "none" }`).
[VoltaRoteador](src/components/VoltaRoteador/index.jsx) intercepta botão físico de voltar do Android e força rota `/tarefas`.

## Estado

Três Contexts, aninhados nesta ordem em `_layout.jsx` (dados → interface):

| Contexto | Provedor | Hook | Responsabilidade |
|---|---|---|---|
| Tarefas | [ProvedorTarefas](src/context/tarefas/ProvedorTarefas.jsx) | `useContextoTarefa` | CRUD + persistência |
| Notificação | [ProvedorNotificacao](src/context/notificacao/ProvedorNotificacao.jsx) | `useContextoNotificacao` | toasts auto-close |
| Modal | [ProvedorModal](src/context/modal/ProvedorModal.jsx) | `useModal` | confirmação (Promise) + loading |

Cada hook lança erro se usado fora do provedor. Sem Redux/Zustand — não introduzir sem pedir.

**Persistência:** AsyncStorage, chave `foco-tarefas`. Salva automaticamente em `useEffect` sobre `tarefas`, protegido por flag `isLoaded` (evita gravar array vazio antes do load inicial).

**Tarefa:** `{ id: number, descricao: string, completed: boolean }`. `id` = `Date.now() + random(1000)`.

**Modal de confirmação** retorna Promise: `const ok = await confirmar({ titulo, mensagem })`.

## Componentes globais

`<NotificacaoGlobal />` e `<ModalGlobal />` ficam montados em `_layout.jsx`, fora das `Tabs` — sempre presentes, controlados só por contexto.

## Estilo

`StyleSheet.create` local em cada arquivo. Sem tema centralizado (`src/assets/style.jsx` está vazio).
Paleta fixa, repetida à mão:

| Cor | Uso |
|---|---|
| `#021123` | fundo (tema escuro) |
| `#B872FF` | roxo — destaque, tab ativa |
| `#144480` | bordas, cards |
| `#98A0A8` | texto secundário, tab inativa |
| `#fff` | texto primário |

Animações: `Animated` da RN core (`useNativeDriver: true`). `react-native-reanimated` está instalado mas não é usado no código atual.

## Imports

Relativos (`../../components/...`) na maior parte. Alias `@/*` → `src/*` configurado em `tsconfig.json` e usado em um ponto ([index.jsx](src/app/index.jsx)). Preferir `@/` em código novo.

## Comandos

```bash
npm start          # expo start
npm run android
npm run ios
npm run web
npm run lint       # expo lint
npx expo start -c  # limpar cache do Metro (usar após mover arquivos)

npm run release:patch   # 1.0.0 -> 1.0.1
npm run release:minor   # 1.0.0 -> 1.1.0
npm run release:major   # 1.0.0 -> 2.0.0
```

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
- `src/assets/style.jsx` está vazio: não há tema centralizado, as cores da paleta são repetidas à mão em cada `StyleSheet`.
- `react-native-reanimated` e `@react-navigation/drawer` estão em `dependencies` mas não são usados no código (drawer foi substituído por Bottom Tabs).
- Sem testes automatizados.

## Convenções

- Nomes em português, componentes em PascalCase, pastas de componente com `index.jsx`.
- Não converter para TypeScript sem pedido explícito.
- Não mover arquivos para fora de `src/` — estrutura `src/` é preferência do dono do repo.
