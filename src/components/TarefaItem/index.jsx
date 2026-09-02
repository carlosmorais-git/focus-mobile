import React, { useEffect, useRef } from "react";
import { Text, View, Pressable, StyleSheet, Animated } from "react-native";
import { IconCheck, IconPencil, IconTrash } from "../Icons";
import useModal from "../../context/modal/useModal";
import useContextoNotificacao from "../../context/notificacao/useContextoNotificacao";

const TarefaItem = ({
  completed,
  texto,
  onPressEdit,
  onPressDelete,
  onTarefaCompleta,
}) => {
  const { confirmar, carregando, fechar } = useModal();
  const { mostrarTarefaCompleta } = useContextoNotificacao();

  // Animações
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const checkScaleAnim = useRef(new Animated.Value(1)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  // Animação quando a tarefa é marcada como completa
  useEffect(() => {
    if (completed) {
      // Animação de celebração
      Animated.sequence([
        // Pulso de celebração
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.05,
            tension: 100,
            friction: 3,
            useNativeDriver: false, // Mudado para false para compatibilidade web
          }),
          Animated.spring(checkScaleAnim, {
            toValue: 1.3,
            tension: 100,
            friction: 3,
            useNativeDriver: false, // Mudado para false para compatibilidade web
          }),
          Animated.timing(celebrationAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false, // Mudado para false para compatibilidade web
          }),
        ]),
        // Volta ao normal
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: false, // Mudado para false para compatibilidade web
          }),
          Animated.spring(checkScaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: false, // Mudado para false para compatibilidade web
          }),
        ]),
      ]).start();

      // Animação da cor de fundo
      Animated.timing(backgroundColorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      // Reset das animações quando não está completa
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      celebrationAnim.setValue(0);
    }
  }, [completed]);

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

  // Função para marcar tarefa como completa com animação
  const marcarCompleta = () => {
    if (!completed) {
      // Mostra notificação de tarefa completa
      mostrarTarefaCompleta(texto);
    }
    onTarefaCompleta();
  };

  // Interpolação da cor de fundo
  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#98A0A8", "#0f725c"],
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
        {/* Ícone marcar completa com animação */}
        <Pressable onPress={marcarCompleta}>
          <Animated.View style={{ transform: [{ scale: checkScaleAnim }] }}>
            <IconCheck checked={completed} />
          </Animated.View>
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

      {/* Efeito de celebração */}
      {completed && (
        <Animated.View
          style={[
            styles.celebrationOverlay,
            {
              opacity: celebrationAnim,
              transform: [
                {
                  scale: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.celebrationText}>✨</Text>
        </Animated.View>
      )}
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
    paddingHorizontal: 12,
    paddingVertical: 18,
    borderRadius: 12,
    margin: 10,
    gap: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  campoChek: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textoContainer: {
    flex: 1,
  },
  text: {
    color: "#021123",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    lineHeight: 22,
  },
  textCompleted: {
    textDecorationLine: "line-through",
    color: "#fff",
    opacity: 0.8,
  },
  botaoDelete: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(220, 53, 69, 0.1)",
  },
  celebrationOverlay: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B872FF",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#B872FF",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 100,
  },
  celebrationText: {
    fontSize: 16,
    color: "#fff",
  },
});
