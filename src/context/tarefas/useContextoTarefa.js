import { useContext } from "react";
import { TaskContext } from "./ProvedorTarefas"; // ajuste o caminho conforme o local do seu contexto

export default function useContextoTarefa() {
  const context = useContext(TaskContext); // busca o valor do contexto.

  if (!context) {
    throw new Error(
      "useContextoTarefa deve ser usado dentro do ProvedorTarefas."
    );
  }

  return context;
}
