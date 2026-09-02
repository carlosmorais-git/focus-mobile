import { useRef, useState } from "react";

export default function useScrollToCursor(alturaLinha = 24) {
  const scrollRef = useRef(null);
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [linhaAtual, setLinhaAtual] = useState(null);
  const [alturaVisivel, setAlturaVisivel] = useState(0);

  const calcularLinha = (texto, cursorPosition) => {
    return texto.substring(0, cursorPosition).split("\n").length;
  };

  const scrollToCursor = (cursorPosition, texto) => {
    if (cursorPosition == null) return;

    const novaLinha = calcularLinha(texto, cursorPosition);
    const posicaoY = (novaLinha - 1) * alturaLinha;

    const topoVisivel = currentScrollY;
    const fundoVisivel = currentScrollY + alturaVisivel;

    const estaVisivel = posicaoY >= topoVisivel && posicaoY <= fundoVisivel;

    if (!estaVisivel) {
      scrollRef.current?.scrollTo({ y: posicaoY, animated: true });
      // console.log(`🟢 Scroll para linha ${novaLinha}, posY ${posicaoY}`);
      setLinhaAtual(novaLinha);
    } else {
      // console.log(`🔵 Linha ${novaLinha} já visível, não faz scroll`);
    }
  };

  const onScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    setCurrentScrollY(y);
  };

  const onLayout = (e) => {
    const altura = e.nativeEvent.layout.height;
    setAlturaVisivel(altura);
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
