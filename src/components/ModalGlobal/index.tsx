import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import useModal from "../../context/modal/ProvedorModal";
import { cores, espaco, fonte, raio, sombra } from "@/theme";
import useValorAnimado from "../../hooks/useValorAnimado";

export default function ModalGlobal() {
  const { modal } = useModal();
  const scaleAnim = useValorAnimado(0);
  const opacityAnim = useValorAnimado(0);

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
  }, [modal.visible, scaleAnim, opacityAnim]);

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
                <Ionicons name="help-circle" size={48} color={cores.destaque} />
              </View>
            )}

            {modal.tipo === "carregando" && (
              <View style={styles.iconeContainer}>
                <ActivityIndicator size="large" color={cores.destaque} />
              </View>
            )}

            <Text style={styles.titulo}>{modal.titulo}</Text>

            {modal.tipo === "carregando" && !!modal.mensagem && (
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
                    <Ionicons name="close" size={20} color={cores.texto} />
                    <Text style={styles.textoBotao}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.botao, styles.botaoConfirmar]}
                    onPress={modal.onConfirmar}
                  >
                    <Ionicons name="checkmark" size={20} color={cores.texto} />
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
    backgroundColor: cores.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: cores.borda,
    padding: espaco.xxl,
    borderRadius: raio.lg,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 12,
    boxShadow: sombra.modal,
    borderWidth: 2,
    borderColor: cores.destaque, // Borda roxa para destaque
  },
  iconeContainer: {
    marginBottom: espaco.lg,
    padding: espaco.xs,
  },
  titulo: {
    fontSize: fonte.xxl,
    fontWeight: "bold",
    marginBottom: espaco.md,
    textAlign: "center",
    color: cores.texto,
  },
  mensagem: {
    fontSize: fonte.md,
    textAlign: "center",
    marginBottom: espaco.xxl,
    color: cores.textoSecundario,
    lineHeight: 22,
  },
  botoes: {
    flexDirection: "row",
    gap: espaco.lg,
    marginTop: espaco.xs,
    width: "100%",
  },
  botao: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: espaco.md,
    paddingHorizontal: espaco.xl,
    borderRadius: raio.md,
    gap: espaco.xs,
  },
  botaoCancelar: {
    backgroundColor: cores.perigo,
    borderWidth: 1,
    borderColor: cores.perigoBorda,
  },
  botaoConfirmar: {
    backgroundColor: cores.sucesso,
    borderWidth: 1,
    borderColor: cores.sucessoBorda,
  },
  textoBotao: {
    color: cores.texto,
    fontWeight: "600",
    fontSize: fonte.md,
  },
});
