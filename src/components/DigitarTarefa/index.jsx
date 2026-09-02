import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSave } from "../../components/Icons";
import useScrollToCursor from "../../hooks/useScrollToCursor";
import FocoBotao from "../../components/FocoBotao";
import useValorAnimado from "../../hooks/useValorAnimado";

const DigitarTarefa = ({
  onPress,
  aparicaoFluida,
  referencia,
  descricao,
  setDescricao,
  texto_botao,
  titulo,
}) => {
  const { scrollRef, scrollToCursor, onScroll, onLayout, resetarLinha } =
    useScrollToCursor(18);

  // Animação botão
  const botaoAnimado = useValorAnimado(0);

  // Controle da altura do input
  const [inputHeight, setInputHeight] = useState(120);
  const ALTURA_MAXIMA = 240;
  const ALTURA_MINIMA = 120;

  const [tecladoAtivo, setTecladoAtivo] = useState(false);

  // ✅ Detecta teclado para animar altura
  useEffect(() => {
    const tecladoMostra = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(botaoAnimado, {
        toValue: 103,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setTecladoAtivo(true);
    });

    const tecladoEsconde = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(botaoAnimado, {
        toValue: -20,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setTecladoAtivo(false);
    });

    return () => {
      tecladoMostra.remove();
      tecladoEsconde.remove();
    };
  }, [botaoAnimado]);

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.label}>{titulo}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexGrow}
      >
        <Animated.View
          style={[
            styles.inner,
            {
              transform: [{ translateY: aparicaoFluida }],
              paddingBottom: tecladoAtivo ? "30%" : "1%",
            },
          ]}
        >
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
            onScroll={onScroll}
            onLayout={onLayout}
            scrollEventThrottle={16}
          >
            <TextInput
              ref={referencia}
              style={[styles.input, { height: inputHeight }]}
              multiline
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Digite algo novo..."
              placeholderTextColor="#999"
              textAlignVertical="top"
              onContentSizeChange={(e) => {
                const altura = e.nativeEvent.contentSize.height;
                if (altura < ALTURA_MAXIMA) {
                  setInputHeight(Math.max(altura, ALTURA_MINIMA));
                } else {
                  setInputHeight(ALTURA_MAXIMA);
                }
              }}
              onFocus={({ nativeEvent }) => {
                const pos = nativeEvent?.selection?.start;
                if (pos !== undefined) {
                  scrollToCursor(pos, descricao);
                }
              }}
              onSelectionChange={({ nativeEvent }) => {
                const pos = nativeEvent?.selection?.start;
                if (pos !== undefined) {
                  scrollToCursor(pos, descricao);
                }
              }}
              onBlur={resetarLinha}
            />
          </ScrollView>
        </Animated.View>

        {/* Botão animado */}
        <Animated.View
          style={[
            styles.containerBotao,
            {
              bottom: botaoAnimado,
            },
          ]}
        >
          <View
            style={[
              styles.botao,
              {
                backgroundColor:
                  descricao.length <= 0 ? "rgb(178, 179, 180)" : "#021123",
              },
            ]}
          >
            <FocoBotao
              titulo={texto_botao}
              img={<IconSave disabled={descricao.length <= 0} />}
              onPress={onPress}
              disabled={descricao.length <= 0}
              outline
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DigitarTarefa;

// 🔥 Estilo ajustado com limite de altura no input
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021123",
    paddingHorizontal: 16,
    // paddingBottom: 5,
    gap: 10,
  },
  header: {
    marginTop: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  flexGrow: {
    flex: 1,
  },
  inner: {
    borderRadius: 8,
    flex: 1,
    paddingBottom: 40,
    gap: 20,
    justifyContent: "space-between",
  },
  scroll: {
    flexGrow: 1,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
    textAlignVertical: "top",
    fontSize: 18,
    padding: 16,
    minHeight: 120,
  },
  containerBotao: {
    elevation: 5,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
    alignItems: "center",
  },
  botao: {
    borderRadius: 32,
    justifyContent: "center",
    width: "95%",
    gap: 40,
  },
});
