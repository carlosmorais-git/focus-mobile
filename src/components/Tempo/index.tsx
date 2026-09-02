import { StyleSheet, Text } from "react-native";
import { cores, espaco, fonte } from "@/theme";

type Props = {
  /** Tempo restante da sessão, em segundos. */
  segundo: number;
};

const Tempo = ({ segundo }: Props) => {
  // Converte o tempo em milissegundos
  const data = new Date(segundo * 1000);
  const formatacao: Intl.DateTimeFormatOptions = {
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
