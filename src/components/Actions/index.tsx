import { Pressable, StyleSheet, Text } from "react-native";
import type { ImageSourcePropType } from "react-native";
import { cores, espaco, raio } from "@/theme";

/** Um modo do Pomodoro: foco, pausa curta ou pausa longa. */
export type Modo = {
  id: number;
  name: string;
  /** Duração do modo, em segundos. */
  tempo: number;
  image: ImageSourcePropType;
};

type Props = {
  modoAtivo: Modo;
  mudarModo: (modo: Modo) => void;
  valueDic: Modo[];
};

const AbasModo = ({ modoAtivo, mudarModo, valueDic }: Props) => {
  return (
    <>
      {/* Vou mapear os modos */}
      {valueDic.map((item, index) => (
        // Pressable é um componente que permite interações de toque
        // Ele é usado para criar botões ou áreas interativas
        <Pressable
          key={item.id}
          style={modoAtivo.id === item.id ? styles.textoModoAtivo : null}
          onPress={() => mudarModo(valueDic[index])}
        >
          <Text style={styles.textModo}>{item.name}</Text>
        </Pressable>
      ))}
    </>
  );
};

export default AbasModo;

const styles = StyleSheet.create({
  textModo: {
    color: cores.texto,
    fontSize: 12.5,
    padding: espaco.xs,
  },
  textoModoAtivo: {
    backgroundColor: cores.borda,
    borderRadius: raio.sm,
  },
});
