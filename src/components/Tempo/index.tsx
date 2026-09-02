import React from "react";
import { StyleSheet, Text } from "react-native";
import { cores, espaco, fonte } from "@/theme";

const Tempo = ({ modoAtivo, segundo }) => {
  // Converte o tempo em milissegundos
  const data = new Date(segundo * 1000);
  const formatacao = {
    minute: "2-digit",
    second: "2-digit",
  };
  return (
    <Text style={styles.timer}>
      {/* Converter para minutos */}
      {data.toLocaleTimeString("pt-BR", formatacao)}
    </Text>
  );
};

export default Tempo;

const styles = StyleSheet.create({
  timer: {
    color: cores.texto,
    fontSize: fonte.cronometro,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: espaco.xl,
  },
});
