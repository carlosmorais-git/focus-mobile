import React, { createContext, useContext, useState } from "react";

export const ModalContext = createContext();

export const ProvedorModal = ({ children }) => {
  const [modal, setModal] = useState({
    visible: false,
    tipo: "confirmacao", // padrao
    titulo: "",
    mensagem: "",
    onConfirmar: null,
    onCancelar: null,
  });

  const confirmar = ({ titulo, mensagem }) => {
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

  const carregando = ({ titulo = "Carregando...", mensagem = "" }) => {
    setModal({
      visible: true,
      tipo: "carregando",
      titulo,
      mensagem,
    });
  };

  const fechar = () => {
    setModal((prev) => ({ ...prev, visible: false }));
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
