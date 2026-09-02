import { useContext } from "react";
import { ModalContext } from "./ProvedorModal";

export default function useModal() {
  const contexto = useContext(ModalContext);

  if (!contexto) {
    throw new Error("useModal deve ser usado dentro de um ProvedorModal.");
  }

  return contexto;
}
