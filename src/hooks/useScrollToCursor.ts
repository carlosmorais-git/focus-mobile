import { useRef, useState } from "react";
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

/**
 * Mantém o cursor visível enquanto o texto cresce dentro de um ScrollView.
 *
 * Calcula em que linha o cursor está, converte para posição vertical e rola
 * só quando essa posição cai fora da faixa visível.
 */
export default function useScrollToCursor(alturaLinha = 24) {
  const scrollRef = useRef<ScrollView>(null);
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [, setLinhaAtual] = useState<number | null>(null);
  const [alturaVisivel, setAlturaVisivel] = useState(0);

  const calcularLinha = (texto: string, cursorPosition: number): number => {
    return texto.substring(0, cursorPosition).split("\n").length;
  };

  const scrollToCursor = (
    cursorPosition: number | null | undefined,
    texto: string
  ) => {
    if (cursorPosition == null) return;

    const novaLinha = calcularLinha(texto, cursorPosition);
    const posicaoY = (novaLinha - 1) * alturaLinha;

    const topoVisivel = currentScrollY;
    const fundoVisivel = currentScrollY + alturaVisivel;

    const estaVisivel = posicaoY >= topoVisivel && posicaoY <= fundoVisivel;

    if (!estaVisivel) {
      scrollRef.current?.scrollTo({ y: posicaoY, animated: true });
      setLinhaAtual(novaLinha);
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrentScrollY(e.nativeEvent.contentOffset.y);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setAlturaVisivel(e.nativeEvent.layout.height);
  };

  const resetarLinha = () => {
    setLinhaAtual(null);
  };

  return {
    scrollRef,
    scrollToCursor,
    onScroll,
    onLayout,
    resetarLinha,
  };
}
