import React, { useState, useRef } from "react";
import { Animated } from "react-native";

import useContextoTarefa from "../../context/tarefas/useContextoTarefa";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import DigitarTarefa from "../../components/DigitarTarefa";

const EditarTarefa = () => {
  //  Contexto para acessar tarefas e editar
  const { tarefas, editarTarefa } = useContextoTarefa();
  // 🔤 Estado do texto da tarefa
  const [descricao, setDescricao] = useState("");

  // Referência do input (para focar automaticamente)
  const referencia = useRef(null);

  //  Recupera o ID da tarefa passado na navegação
  const { id } = useLocalSearchParams();

  // Inicializa o valor da animação (entrada fluida do input)
  const aparicaoFluida = useRef(new Animated.Value(700)).current;

  //  Filtra a tarefa específica que será editada
  const tarefaSelecionada = tarefas.find((t) => t.id.toString() === id);

  /**
   * Animação + foco no input ao abrir a tela
   * Executa sempre que a tela é focada
   * o useFocusEffect simula um gatilho de foco na tela
   * para que a animação e o foco no input aconteçam sempre que a tela é aberta
   */
  useFocusEffect(
    React.useCallback(() => {
      // Resetar posição da animação (começa fora da tela)
      aparicaoFluida.setValue(700);

      // Iniciar animação de entrada
      Animated.timing(aparicaoFluida, {
        toValue: 0, // Para o centro
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Preenche o input com a descrição da tarefa selecionada
      setDescricao(tarefaSelecionada?.descricao || "");

      // Foca no input após um pequeno delay (espera animação iniciar)
      const foco = setTimeout(() => {
        referencia.current?.focus();
      }, 300);

      // Limpa timeout ao sair da tela
      return () => clearTimeout(foco);
    }, [id, tarefaSelecionada?.descricao])
  );

  // ✅ Confirma e salva a edição da tarefa
  const confirmarEdicao = () => {
    if (!descricao.trim()) return; // Impede salvar vazio
    editarTarefa(Number(id), descricao.trim());
    setDescricao("");
    router.navigate("../tarefas"); // Volta para a tela de tarefas
  };

  return (
    <DigitarTarefa
      titulo="O que vamos editar?"
      texto_botao="Confirmar Edição"
      aparicaoFluida={aparicaoFluida}
      referencia={referencia}
      descricao={descricao}
      setDescricao={setDescricao}
      onPress={confirmarEdicao}
    />
  );
};

export default EditarTarefa;
