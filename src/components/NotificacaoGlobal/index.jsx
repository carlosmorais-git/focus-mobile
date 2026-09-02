import {
  Animated,
  StyleSheet,
  Text,
  View,
  Pressable,
  Easing,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import useContextoNotificacao from "../../context/notificacao/useContextoNotificacao";

export default function NotificacaoGlobal() {
  const { notificacao, fecharNotificacao } = useContextoNotificacao();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const { visible, tipo, titulo, mensagem } = notificacao;

  const estilosNotificacoes = {
    sucesso: {
      cor: "#28a745",
      corBorda: "#1e7e34",
      icone: "checkmark-circle",
    },
    excluir: {
      cor: "#dc3545",
      corBorda: "#c82333",
      icone: "trash",
    },
    alerta: {
      cor: "#ffc107",
      corBorda: "#e0a800",
      icone: "warning",
    },
    info: {
      cor: "#007bff",
      corBorda: "#0056b3",
      icone: "information-circle",
    },
    tarefa_completa: {
      cor: "#B872FF",
      corBorda: "#9A5CD6",
      icone: "checkmark-done-circle",
    },
  };

  // Caso não retorna nada, é esperado ao menos o estilo do info
  const config = estilosNotificacoes[tipo] || estilosNotificacoes["info"];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: visible ? 0 : -200, // Sobe ou desce suavemente
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: visible ? 1 : 0.5,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  }, [visible]);

  // if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.cor,
          borderColor: config.corBorda,
          opacity,
          transform: [{ translateY }, { scale }],
          pointerEvents: visible ? "auto" : "none", // Só interage se visível
        },
      ]}
    >
      <View style={styles.conteudo}>
        <View style={styles.iconeContainer}>
          <Ionicons name={config.icone} size={24} color="#fff" />
        </View>

        <View style={styles.textoArea}>
          <Text style={styles.titulo}>{titulo}</Text>
          {mensagem && (
            <Text style={styles.mensagem} numberOfLines={3}>
              {mensagem}
            </Text>
          )}
        </View>

        {/* Botão para fechar a notificação */}
        <Pressable style={styles.botaoFechar} onPress={fecharNotificacao}>
          <Ionicons name="close" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Barra de progresso para auto-close */}
      <View style={styles.barraProgresso}>
        <Animated.View
          style={[styles.progressoFill, { backgroundColor: config.corBorda }]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60, // Mais espaço do topo
    left: 16,
    right: 16,
    borderRadius: 16,
    borderWidth: 2,

    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 999,
    overflow: "hidden",
  },
  conteudo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  textoArea: {
    flex: 1,
    flexDirection: "column",
  },
  titulo: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  mensagem: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 18,
  },
  botaoFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  barraProgresso: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  progressoFill: {
    height: "100%",
    width: "100%",
  },
});
