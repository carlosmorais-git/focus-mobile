import { Pressable, StyleSheet, Text } from "react-native";
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
    backgroundColor: "#B872FF",
    borderRadius: 32,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  botaoText: {
    color: "#021123",
    fontSize: 18,
  },
  botaoOutline: {
    backgroundColor: "transparent",
    borderColor: "#b872ff",
    borderWidth: 2,
  },
  botaoOutlineDisabled: {
    backgroundColor: "transparent",
    borderColor: "rgba(114, 114, 114, 0.88)",
    borderWidth: 2,
  },
  textoOutline: {
    color: "#b872ff",
  },
  textoDisabled: {
    color: "rgba(114, 114, 114, 0.88)",
  },
});
