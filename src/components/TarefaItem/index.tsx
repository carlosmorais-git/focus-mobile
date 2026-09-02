import React, { useEffect } from "react";
import { Text, View, Pressable, StyleSheet, Animated } from "react-native";
import { IconCheck, IconTrash } from "../Icons";
import useModal from "../../context/modal/ProvedorModal";
import useValorAnimado from "../../hooks/useValorAnimado";
import { cores, espaco, fonte, raio, sombra } from "@/theme";

const TarefaItem = ({
  completed,
  texto,
  onPressEdit,
  onPressDelete,
  onTarefaCompleta,
}) => {
  const { confirmar, carregando, fechar } = useModal();

  // Animações
  const scaleAnim = useValorAnimado(1);
  const opacityAnim = useValorAnimado(1);
  const backgroundColorAnim = useValorAnimado(0);

  // Anima a cor de fundo quando a tarefa é marcada como completa
  useEffect(() => {
    Animated.timing(backgroundColorAnim, {
      toValue: completed ? 1 : 0,
      duration: completed ? 500 : 300,
      useNativeDriver: false,
    }).start();
  }, [completed, backgroundColorAnim]);

  // Função para excluir tarefa com confirmação
  const excluirTarefa = async () => {
    const resp = await confirmar({
      titulo: "Deseja excluir?",
      mensagem: "Essa ação não poderá ser desfeita.",
    });

    if (resp) {
      carregando({ titulo: "Excluindo...", mensagem: "Por favor, aguarde." });

      // Animação de saída antes de excluir
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false, // Mudado para false para compatibilidade web
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false, // Mudado para false para compatibilidade web
        }),
      ]).start();

      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(1000); // Tempo reduzido para melhor UX

      onPressDelete(); // <- Deleta a tarefa
      fechar();
    }
  };

  // Interpolação da cor de fundo
  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [cores.tarefaPendente, cores.tarefaConcluida],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.campoChek}>
        {/* Ícone marcar completa */}
        <Pressable onPress={onTarefaCompleta}>
          <IconCheck checked={completed} />
        </Pressable>

        {/* Editar mensagem */}
        <Pressable onPress={onPressEdit} style={styles.textoContainer}>
          <Text
            style={[styles.text, completed && styles.textCompleted]}
            numberOfLines={3}
          >
            {texto}
          </Text>
        </Pressable>
      </View>

      {/* Ícone deletar */}
      <Pressable onPress={excluirTarefa} style={styles.botaoDelete}>
        <IconTrash />
      </Pressable>
    </Animated.View>
  );
};

export default TarefaItem;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espaco.md,
    paddingVertical: 18,
    borderRadius: raio.md,
    margin: espaco.sm,
    gap: espaco.sm,
    elevation: 3,
    boxShadow: sombra.card,
    borderWidth: 1,
    borderColor: cores.bordaSutil,
  },
  campoChek: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.md,
  },
  textoContainer: {
    flex: 1,
  },
  text: {
    color: cores.textoSobreClaro,
    fontSize: fonte.md,
    fontWeight: "600",
    textAlign: "left",
    lineHeight: 22,
  },
  textCompleted: {
    textDecorationLine: "line-through",
    color: cores.texto,
    opacity: 0.8,
  },
  botaoDelete: {
    padding: espaco.xs,
    borderRadius: raio.sm,
    backgroundColor: cores.perigoFundo,
  },
});
