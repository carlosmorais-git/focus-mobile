import { Pressable, StyleSheet, Text } from "react-native";
import { cores, espaco, fonte, raio } from "@/theme";
// Componente FocoBotao que representa um botão de play ou ação
const FocoBotao = ({ titulo, onPress, img, outline, disabled }) => {
  return (
    <Pressable
      style={[
        styles.botao,
        outline && styles.botaoOutline,
        disabled && styles.botaoOutlineDisabled,
      ]}
      onPress={onPress}
    >
      {img}
      <Text
        style={[
          styles.botaoText,
          outline && styles.textoOutline,
          disabled && styles.textoDisabled,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
};
export default FocoBotao;

const styles = StyleSheet.create({
  botao: {
    backgroundColor: cores.destaque,
    borderRadius: raio.pilula,
    padding: espaco.xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: espaco.md,
  },
  botaoText: {
    color: cores.textoSobreClaro,
    fontSize: fonte.lg,
  },
  botaoOutline: {
    backgroundColor: "transparent",
    borderColor: cores.destaque,
    borderWidth: 2,
  },
  botaoOutlineDisabled: {
    backgroundColor: "transparent",
    borderColor: cores.desabilitado,
    borderWidth: 2,
  },
  textoOutline: {
    color: cores.destaque,
  },
  textoDisabled: {
    color: cores.desabilitado,
  },
});
