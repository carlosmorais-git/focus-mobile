import React, { useState, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconPlay, IconPause } from "../../components/Icons"; // Importando os ícones de play e pause
import Img_foco from "../../assets/images/Imagem foco.png";
import Img_curto from "../../assets/images/Imagem descanso curto.png";
import Img_longo from "../../assets/images/Imagem descanso longo.png";
import AbasModo, { type Modo } from "../../components/Actions";
import FocoBotao from "../../components/FocoBotao";
import Tempo from "../../components/Tempo";
import Footer from "../../components/Footer";
import { cores, espaco, fonte, raio } from "@/theme";

const valueDic: Modo[] = [
  { id: 1, name: "Foco", tempo: 25 * 60, image: Img_foco },
  { id: 2, name: "Pausa curta", tempo: 5 * 60, image: Img_curto },
  { id: 3, name: "Pausa longa", tempo: 15 * 60, image: Img_longo },
];

export default function Pomodoro() {
  // controla rotas

  const [modoAtivo, setModoAtivo] = useState(valueDic[0]); // Estado para armazenar o modo ativo
  const [segundo, setSegundo] = useState(valueDic[0].tempo); // Estado para armazenar o segundo atual
  const [modoRodando, setModoRodando] = useState(false); // Estado para armazenar se o modo está rodando
  // Referência para o temporizador
  const tempoRef = useRef<ReturnType<typeof setInterval> | null>(null); // Referência para o temporizador
  // Função para mudar o modo ativo
  const limpar = () => {
    if (tempoRef.current !== null) {
      clearInterval(tempoRef.current);
      tempoRef.current = null; // Limpa o temporizador ao mudar de modo
      setModoRodando(false); // Reseta o estado de rodando ao mudar de modo
    }
  };
  const mudarModo = (modo: Modo) => {
    setModoAtivo(modo);
    setSegundo(modo.tempo); // ← reseta o tempo conforme o novo modo
    limpar(); // Limpa o temporizador atual antes de mudar o modo
  };
  const trocarTempo = () => {
    if (tempoRef.current) {
      limpar(); // Se já estiver rodando, limpa o temporizador
      return;
    }
    setModoRodando(true); // Define o estado de rodando como verdadeiro

    const timeoutId = setInterval(() => {
      setSegundo((prevSegundo) => {
        if (prevSegundo === 0) {
          limpar(); // Limpa o temporizador se chegar a 0
          return modoAtivo.tempo; // Reseta o tempo para o valor do modo ativo
        }
        return prevSegundo - 1; // Decrementa o segundo
      });
    }, 1000); // decremetar a cada segundo
    tempoRef.current = timeoutId; // Armazena o ID do temporizador
  };

  return (
    // Area de exibicao 'View = DIV'
    <SafeAreaView style={styles.container}>
      {/* Imagem da tela Foco */}
      <Image
        source={modoAtivo.image}
        style={styles.imagem}
        resizeMode="contain"
      />
      <View style={styles.actions}>
        <View style={styles.modoContainer}>
          {/* Componente AbasModo */}
          <AbasModo
            modoAtivo={modoAtivo}
            mudarModo={mudarModo}
            valueDic={valueDic}
          />
        </View>
        <Tempo segundo={segundo} />
        <FocoBotao
          titulo={modoRodando ? "Pausar" : "Começar"}
          img={modoRodando ? <IconPause /> : <IconPlay />}
          onPress={trocarTempo}
        />
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: cores.fundo,
    paddingTop: 50,
    gap: espaco.gigante,
  },

  imagem: {
    width: 266,
    height: 266,
    padding: espaco.sm,
  },
  actions: {
    paddingVertical: espaco.xxl,
    paddingHorizontal: espaco.xxl,
    backgroundColor: cores.painel,
    borderRadius: raio.pilula,
    width: "80%",
    borderWidth: 2,
    borderColor: cores.borda,
    gap: espaco.xxxl,
  },
  modoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: espaco.sm,
  },
  footer: {
    bottom: 0,
    width: "80%",
    padding: espaco.lg,
    alignItems: "center",
  },
  footerText: {
    color: cores.textoSecundario,
    fontSize: fonte.sm,
  },
});
