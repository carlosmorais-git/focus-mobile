import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import useModal from "../../context/modal/useModal";

export default function ModalGlobal() {
  const { modal } = useModal();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modal.visible) {
      // Animação de entrada
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: false, // Mudado para false para compatibilidade web
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false, // Mudado para false para compatibilidade web
        }),
      ]).start();
    } else {
      // Animação de saída
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false, // Mudado para false para compatibilidade web
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false, // Mudado para false para compatibilidade web
        }),
      ]).start();
    }
  }, [modal.visible]);

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Modal
        transparent
        animationType="none" // Usamos nossa própria animação
        visible={modal.visible}
        onRequestClose={() => {
          if (modal.onCancelar) modal.onCancelar();
        }}
      >
        <Animated.View style={[styles.fundo, { opacity: opacityAnim }]}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Ícone do tipo de modal */}
            {modal.tipo === "confirmacao" && (
              <View style={styles.iconeContainer}>
                <Ionicons name="help-circle" size={48} color="#B872FF" />
              </View>
            )}

            {modal.tipo === "carregando" && (
              <View style={styles.iconeContainer}>
                <ActivityIndicator size="large" color="#B872FF" />
              </View>
            )}

            <Text style={styles.titulo}>{modal.titulo}</Text>

            {modal.tipo === "carregando" && modal.mensagem && (
              <Text style={styles.mensagem}>{modal.mensagem}</Text>
            )}

            {modal.tipo === "confirmacao" && (
              <>
                <Text style={styles.mensagem}>{modal.mensagem}</Text>
                <View style={styles.botoes}>
                  <Pressable
                    style={[styles.botao, styles.botaoCancelar]}
                    onPress={modal.onCancelar}
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                    <Text style={styles.textoBotao}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.botao, styles.botaoConfirmar]}
                    onPress={modal.onConfirmar}
                  >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.textoBotao}>Confirmar</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "rgba(2, 17, 35, 0.8)", // Cor de fundo mais escura para combinar com o tema
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#144480", // Cor de fundo do modal combinando com o tema
    padding: 24,
    borderRadius: 20,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 2,
    borderColor: "#B872FF", // Borda roxa para destaque
  },
  iconeContainer: {
    marginBottom: 16,
    padding: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#fff", // Texto branco
  },
  mensagem: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#98A0A8", // Cor cinza clara para o texto secundário
    lineHeight: 22,
  },
  botoes: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    width: "100%",
  },
  botao: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  botaoCancelar: {
    backgroundColor: "#dc3545",
    borderWidth: 1,
    borderColor: "#c82333",
  },
  botaoConfirmar: {
    backgroundColor: "#28a745",
    borderWidth: 1,
    borderColor: "#1e7e34",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
