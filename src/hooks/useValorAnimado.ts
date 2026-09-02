import { useState } from "react";
import { Animated } from "react-native";

/**
 * Cria um Animated.Value estável durante todo o ciclo de vida do componente.
 *
 * Substitui `useRef(new Animated.Value(x)).current`, que viola a regra
 * react-hooks/refs (ler ref durante o render). O inicializador preguiçoso do
 * useState garante que o Animated.Value seja instanciado uma única vez.
 *
 * A RN expõe `useAnimatedValue` com o mesmo propósito, mas o react-native-web
 * não reexporta esse hook — por isso a versão local.
 */
export default function useValorAnimado(valorInicial = 0): Animated.Value {
  const [valor] = useState(() => new Animated.Value(valorInicial));
  return valor;
}
