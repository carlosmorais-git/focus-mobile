import { useEffect, useState } from "react";
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
import type { RefObject } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSave } from "../../components/Icons";
import useScrollToCursor from "../../hooks/useScrollToCursor";
import { cores, espaco, fonte, raio, sombra } from "@/theme";
import FocoBotao from "../../components/FocoBotao";
import useValorAnimado from "../../hooks/useValorAnimado";

type Props = {
  onPress: () => void;
  /** Valor animado da entrada da tela, controlado pela rota que monta o form. */
  aparicaoFluida: Animated.Value;
  /** Ref do TextInput, para focar automaticamente ao abrir. */
  referencia: RefObject<TextInput | null>;
  descricao: string;
  setDescricao: (descricao: string) => void;
  texto_botao: string;
  titulo: string;
};

const DigitarTarefa = ({
  onPress,
  aparicaoFluida,
  referencia,
  descricao,
  setDescricao,
  texto_botao,
  titulo,
}: Props) => {
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
              placeholderTextColor={cores.placeholder}
              textAlignVertical="top"
              onContentSizeChange={(e) => {
                const altura = e.nativeEvent.contentSize.height;
                if (altura < ALTURA_MAXIMA) {
                  setInputHeight(Math.max(altura, ALTURA_MINIMA));
                } else {
                  setInputHeight(ALTURA_MAXIMA);
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
                  descricao.length <= 0 ? cores.iconeInativo : cores.textoSobreClaro,
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
    backgroundColor: cores.fundo,
    paddingHorizontal: espaco.lg,
    // paddingBottom: 5,
    gap: espaco.sm,
  },
  header: {
    marginTop: espaco.xs,
    marginBottom: espaco.lg,
  },
  label: {
    fontSize: fonte.xl,
    fontWeight: "bold",
    color: cores.texto,
  },
  flexGrow: {
    flex: 1,
  },
  inner: {
    borderRadius: raio.sm,
    flex: 1,
    paddingBottom: espaco.gigante,
    gap: espaco.xl,
    justifyContent: "space-between",
  },
  scroll: {
    flexGrow: 1,
  },
  input: {
    flex: 1,
    borderRadius: raio.sm,
    backgroundColor: cores.campo,
    color: cores.textoCampo,
    textAlignVertical: "top",
    fontSize: fonte.lg,
    padding: espaco.lg,
    minHeight: 120,
  },
  containerBotao: {
    elevation: 5,
    boxShadow: sombra.botao,
    alignItems: "center",
  },
  botao: {
    borderRadius: raio.pilula,
    justifyContent: "center",
    width: "95%",
    gap: espaco.gigante,
  },
});
