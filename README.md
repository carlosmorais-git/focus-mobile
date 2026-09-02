# 🎯 FOCO — App de Produtividade e Pomodoro

Aplicativo mobile que combina **técnica Pomodoro** e **gerenciamento de tarefas**, desenvolvido com **React Native + Expo**.

---

## ✨ Funcionalidades

- 🍅 **Timer Pomodoro** — Sessões de foco com cronômetro
- 📋 **Lista de Tarefas** — Criar, editar, excluir e marcar como concluída
- 🎨 **Animações** — Feedback visual ao completar tarefas
- 📱 **Navegação por Abas** — Interface moderna com bottom tabs
- 🌙 **Tema Escuro** — Design em tons escuros e roxos

---

## 🚀 Como Rodar

```bash
# Clone o repositório
git clone https://github.com/carlosmorais-git/AplicativoFocus.git
cd AplicativoFocus

# Instale as dependências
npm install

# Inicie o app
npm start
```

💡 **No Windows:** execute `iniciar-projeto-foco.bat`  
Depois, escaneie o QR Code com o **Expo Go** ou use o emulador (`a` para Android, `i` para iOS).

---

## 🧩 Stack

React Native • Expo • Expo Router • Context API • AsyncStorage

---

## 🏗️ Estrutura

```
src/
├── app/                    # Rotas (expo-router)
│   ├── _layout.jsx         # Layout raiz: providers + bottom tabs
│   ├── index.jsx           # Tela inicial
│   ├── pomodoro.jsx        # Aba Foco — cronômetro
│   ├── tarefas/            # Aba Tarefas — lista
│   ├── add_tarefa/         # Adicionar tarefa
│   ├── edit_tarefa/        # Editar tarefa ([id].jsx)
│   └── dialog_pagina/      # Tela de teste de modais/notificações
│
├── components/             # Componentes (cada um em pasta com index.jsx)
│   ├── Actions/            # Botões de modo do Pomodoro
│   ├── DigitarTarefa/      # Formulário de tarefa
│   ├── FocoBotao/          # Botão principal
│   ├── Footer/             # Rodapé
│   ├── Icons/              # Ícones SVG
│   ├── ModalGlobal/        # Modal reutilizável
│   ├── NotificacaoGlobal/  # Sistema de notificações
│   ├── TarefaItem/         # Item da lista
│   ├── Tempo/              # Display do cronômetro
│   └── VoltaRoteador/      # Botão físico de voltar (Android)
│
├── context/                # Estado global (Context API)
│   ├── modal/              # Controle de modais
│   ├── notificacao/        # Controle de notificações
│   └── tarefas/            # Controle global de tarefas + AsyncStorage
│
├── hooks/                  # Hooks reutilizáveis
│
└── assets/                 # Imagens, fontes
    ├── Designer/           # Prints do app funcionando
    ├── fonts/
    └── images/
```

---

## 🔧 Scripts

```bash
npm start          # Iniciar o app
npm run android    # Executar no Android
npm run ios        # Executar no iOS
npm run web        # Executar na web
npm run lint       # Verificar código
```

### Versionamento

```bash
npm run release:patch   # 1.0.0 -> 1.0.1  (correção)
npm run release:minor   # 1.0.0 -> 1.1.0  (funcionalidade nova)
npm run release:major   # 1.0.0 -> 2.0.0  (quebra compatibilidade)
```

Cada um faz o ciclo completo: sobe a versão no `package.json`, sincroniza o `app.json`
(`expo.version`, `android.versionCode` +1, `ios.buildNumber`), commita os dois juntos
e cria a tag git.

⚠️ Exige a árvore do git limpa — commite ou guarde as alterações antes.

---

## ❓ FAQ

**O app funciona offline?**  
✅ Sim! Todos os dados são armazenados localmente.

**Posso personalizar o tempo do Pomodoro?**  
🕒 Ainda não, mas está no roadmap.

**Consome muita bateria?**  
🔋 Não! As animações usam a API `Animated` da React Native com `useNativeDriver`, rodando na thread nativa.

**Funciona em tablets?**  
📱 Sim, com layout responsivo.

---

## 📋 Roadmap

- [ ] Persistência de dados (AsyncStorage)
- [ ] Estatísticas de produtividade
- [ ] Notificações push
- [ ] Temas personalizáveis
- [ ] Backup na nuvem

---

## 🤝 Contribuindo

1. Faça um fork
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit (`git commit -m "feat: adiciona NovaFeature"`)
4. Push (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

🐛 **Reportar bugs:** [Issues](https://github.com/carlosmorais-git/AplicativoFocus/issues)

---

## 📈 Versão 2.0 — Refatoração Completa (Out/2025)

**Principais mudanças:**

- Drawer → Bottom Tabs
- Tema escuro moderno (#021123 / #B872FF)
- Animações com a API `Animated` (nativas, via `useNativeDriver`)
- UX aprimorada e feedback visual em todas as ações

---

## 🧾 Licença

Licenciado sob **MIT** — veja [LICENSE](LICENSE).

---

## 📞 Contato

**Carlos Morais** — [GitHub](https://github.com/carlosmorais-git)  
📦 Projeto: [AplicativoFocus](https://github.com/carlosmorais-git/AplicativoFocus)

---

_Desenvolvido com ❤️ usando React Native e Expo._
