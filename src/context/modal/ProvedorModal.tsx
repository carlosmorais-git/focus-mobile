import { createContext, useContext, useState, type ReactNode } from "react";

export type TipoModal = "confirmacao" | "carregando";

export type EstadoModal = {
  visible: boolean;
  tipo: TipoModal;
  titulo: string;
  mensagem: string;
  /** Só existem no tipo "confirmacao"; resolvem a Promise de `confirmar`. */
  onConfirmar?: (() => void) | null;
  onCancelar?: (() => void) | null;
};

type ContextoModal = {
  modal: EstadoModal;
  /** Abre o modal e resolve com a escolha do usuário. */
  confirmar: (opcoes: { titulo: string; mensagem: string }) => Promise<boolean>;
  carregando: (opcoes: { titulo?: string; mensagem?: string }) => void;
  fechar: () => void;
};

export const ModalContext = createContext<ContextoModal | null>(null);

export const ProvedorModal = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<EstadoModal>({
    visible: false,
    tipo: "confirmacao", // padrao
    titulo: "",
    mensagem: "",
    onConfirmar: null,
    onCancelar: null,
  });

  const fechar = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const confirmar = ({
    titulo,
    mensagem,
  }: {
    titulo: string;
    mensagem: string;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setModal({
        visible: true,
        tipo: "confirmacao",
        titulo,
        mensagem,
        onConfirmar: () => {
          resolve(true);
          fechar();
        },
        onCancelar: () => {
          resolve(false);
          fechar();
        },
      });
    });
  };

  const carregando = ({
    titulo = "Carregando...",
    mensagem = "",
  }: {
    titulo?: string;
    mensagem?: string;
  }) => {
    setModal({
      visible: true,
      tipo: "carregando",
      titulo,
      mensagem,
      // Zera os callbacks da confirmação anterior: sem isso um clique fantasma
      // resolveria a Promise de um modal que já saiu de cena
      onConfirmar: null,
      onCancelar: null,
    });
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        confirmar,
        carregando,
        fechar,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/** Acessa o contexto de modal. Lança se usado fora do ProvedorModal. */
export default function useModal(): ContextoModal {
  const contexto = useContext(ModalContext);

  if (!contexto) {
    throw new Error("useModal deve ser usado dentro de um ProvedorModal.");
  }

  return contexto;
}
