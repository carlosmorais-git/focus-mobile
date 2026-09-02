<div align="center">

<img src="src/assets/images/logo.png" width="120" alt="Logo do FOCO">

# FOCO

Timer Pomodoro e gerenciador de tarefas em React Native.

`React Native 0.86` · `Expo SDK 57` · `expo-router` · `Context API` · `AsyncStorage`

</div>

---

## Telas

| Início | Cronômetro |
|---|---|
| <img src="src/assets/Designer/1_capa_inicio.jpg" width="260"> | <img src="src/assets/Designer/2_cronometro.jpg" width="260"> |

| Tarefas | Nova tarefa |
|---|---|
| <img src="src/assets/Designer/3_lista_tarefas.jpg" width="260"> | <img src="src/assets/Designer/4_criar_tarefas.jpg" width="260"> |

---

## O que faz

- **Pomodoro** com três modos: foco (25 min), descanso curto (5) e longo (15)
- **Tarefas** com criar, editar, excluir e concluir
- **Persistência local** em AsyncStorage — funciona offline, nada sai do aparelho
- **Modal de confirmação** baseado em Promise: `const ok = await confirmar({ titulo, mensagem })`
- Tema escuro, tokens centralizados em [`src/theme/`](src/theme/index.js)

---

## Rodando

```bash
git clone https://github.com/carlosmorais-git/AplicativoFocus.git
cd AplicativoFocus
npm install
npm start
```

Escaneie o QR Code com o **Expo Go**, ou tecle `a` (Android), `i` (iOS), `w` (web).

### Por cabo USB

Sem Wi-Fi, ou em rede que bloqueia a porta do Metro:

```bash
npm run adb:devices   # confere se o aparelho aparece
npm run android:usb   # espera o device, cria o túnel adb, abre o app
```

O túnel cai quando o cabo desconecta — rode `npm run adb:reverse` de novo.
`adb devices` mostrando `unauthorized` é o popup de depuração USB pendente no aparelho.

---

## Estrutura

```
src/
├── app/                    # rotas (expo-router, file-based)
│   ├── _layout.jsx         # Stack raiz + providers
│   ├── index.jsx           # tela inicial
│   ├── (tabs)/             # as abas são UMA tela do Stack
│   │   ├── _layout.jsx     # Bottom Tabs
│   │   ├── pomodoro.jsx    # aba Foco
│   │   └── tarefas/        # aba Tarefas
│   ├── add_tarefa/         # empilha por cima das abas
│   └── edit_tarefa/[id].jsx
│
├── components/             # um componente por pasta, com index.jsx
├── context/                # Context API: provedor + hook por domínio
├── hooks/
├── theme/                  # cores, espaçamento, raio, fonte
└── assets/
```

Navegação é um **Stack na raiz** com as abas como primeira tela; `add_tarefa` e
`edit_tarefa` empilham por cima e ganham voltar nativo. Os parênteses em `(tabs)`
marcam um grupo de rotas — não entram na URL, então as rotas seguem `/pomodoro` e
`/tarefas`.

---

## Scripts

```bash
npm start              # expo start
npm run android        # abre no Android
npm run ios            # abre no iOS
npm run web            # abre no navegador
npm run lint           # expo lint

npm run android:usb    # Android por cabo (túnel adb + Metro em IPv4)
npm run adb:reverse    # só o túnel
npm run adb:devices    # lista aparelhos

npm run release:patch  # 1.0.0 -> 1.0.1
npm run release:minor  # 1.0.0 -> 1.1.0
npm run release:major  # 1.0.0 -> 2.0.0
```

Os `release:*` fazem o ciclo inteiro: sobem a versão no `package.json`, sincronizam o
`app.json` (`expo.version`, `android.versionCode` +1, `ios.buildNumber`), commitam os dois
juntos e criam a tag. Exigem a árvore do git limpa.

---

## Estado

`expo lint` fecha em zero, `npx expo-doctor` em 21/21. Sem testes automatizados.

O plano do que falta — e o que é defeito conhecido e adiado de propósito — está no
[Roadmap.md](Roadmap.md), com arquivo e linha em cada item.

---

## Licença

MIT — veja [LICENSE](LICENSE).

**Carlos Morais** · [github.com/carlosmorais-git](https://github.com/carlosmorais-git)
