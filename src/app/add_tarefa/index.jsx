import React, { useState, useRef } from "react";
import { Animated } from "react-native";
import useContextoTarefa from "../../context/tarefas/useContextoTarefa";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import DigitarTarefa from "../../components/DigitarTarefa";
import useContextoNotificacao from "../../context/notificacao/useContextoNotificacao";

const AddTarefa = () => {
  // Contexto para acessar tarefas e adicionar nova tarefa
  const { addTarefa } = useContextoTarefa();
  const { showNotificacao } = useContextoNotificacao();

  // Estado para armazenar a descrição da nova tarefa
  const [descricao, setDescricao] = useState("");

  // Referência do input para focar automaticamente
  const referencia = useRef(null);

  // Inicializa o valor da animação (entrada fluida do input)
  const aparicaoFluida = useRef(new Animated.Value(300)).current;

  /**
   * Animação + foco no input ao abrir a tela
   * Executa sempre que a tela é focada
   * o useFocusEffect simula um gatilho de foco na tela
   * para que a animação e o foco no input aconteçam sempre que a tela é aberta
   */

  useFocusEffect(
    React.useCallback(() => {
      aparicaoFluida.setValue(700);

      Animated.timing(aparicaoFluida, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const foco = setTimeout(() => {
        referencia.current?.focus();
      }, 300);

      return () => clearTimeout(foco);
    }, [])
  );

  const enviarTarefa = () => {
    if (!descricao.trim()) return;
    addTarefa(descricao.trim());
    setDescricao("");
    showNotificacao({
      tipo: "sucesso",
      titulo: "Sucesso!",
      mensagem: "Tarefa adicionada com sucesso!",
    });
    router.navigate("../tarefas");
  };

  return (
    <DigitarTarefa
      titulo="Em que você está trabalhando?"
      texto_botao="Salvar Tarefa"
      aparicaoFluida={aparicaoFluida}
      referencia={referencia}
      descricao={descricao}
      setDescricao={setDescricao}
      onPress={enviarTarefa}
    />
  );
};

export default AddTarefa;
