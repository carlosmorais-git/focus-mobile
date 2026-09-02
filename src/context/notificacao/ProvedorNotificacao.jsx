import React, { createContext, useState, useRef, useContext } from "react";

export const NotificacaoContext = createContext();

export function ProvedorNotificacao({ children }) {
  const [notificacao, setNotificacao] = useState({
    visible: false,
    tipo: "info", // success | error | info | warning | tarefa_completa
    titulo: "",
    mensagem: "",
  });

  const timeoutRef = useRef(null);

  const showNotificacao = ({
    tipo = "info",
    titulo = "",
    mensagem = "",
    tempo = 4000, // Tempo na tela
  }) => {
    // Limpa timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotificacao({
      visible: true,
      tipo,
      titulo,
      mensagem,
    });

    // Auto-close após o tempo especificado
    timeoutRef.current = setTimeout(() => {
      fecharNotificacao();
    }, tempo);
  };

  const fecharNotificacao = () => {
    // Limpa o timeout se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setNotificacao((prev) => ({ ...prev, visible: false }));
  };

  // Função específica para notificação de tarefa completa com animação especial
  const mostrarTarefaCompleta = (nomeTarefa) => {
    showNotificacao({
      tipo: "tarefa_completa",
      titulo: "Tarefa Concluída! 🎉",
      mensagem: `"${nomeTarefa}" foi marcada como completa`,
      tempo: 5000, // Mais tempo para celebrar
    });
  };

  return (
    <NotificacaoContext.Provider
      value={{
        notificacao,
        showNotificacao,
        fecharNotificacao,
        mostrarTarefaCompleta,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
}

export default function useContextoNotificacao() {
  const context = useContext(NotificacaoContext); // busca o valor do contexto.

  if (!context) {
    throw new Error(
      "useContextoTarefa deve ser usado dentro do ProvedorNotificacao."
    );
  }

  return context;
}