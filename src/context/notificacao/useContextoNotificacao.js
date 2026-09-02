import { useContext } from "react";
import { NotificacaoContext } from "./ProvedorNotificacao";

export default function useContextoNotificacao() {
  const context = useContext(NotificacaoContext); // busca o valor do contexto.

  if (!context) {
    throw new Error(
      "useContextoTarefa deve ser usado dentro do ProvedorNotificacao."
    );
  }

  return context;
}
