import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { router } from "expo-router";

/**
 * 🔥 Componente utilitário para sobrescrever o botão nativo de voltar.
 *
 * @param {string} rota - Caminho para onde deve navegar ao voltar. (ex: "/tarefas")
 * @param {boolean} debug - Se true, exibe logs no console (opcional).
 */
export default function Roteador({ rota = "/", debug = false }) {
  const navigation = useNavigation();

  useEffect(() => {
    if (debug) {
      console.log(`🟦 Roteador ativado. Voltar vai para: ${rota}`);
    }

    // 🔸 Intercepta botão de voltar da header (seta do topo)
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (debug) console.log("🔸 Evento: Header Back");
      e.preventDefault();
      router.push(rota);
    });

    // 🔹 Intercepta botão físico do Android
    const backAction = () => {
      if (debug) console.log("🔹 Evento: Botão físico Back");
      router.push(rota);
      return true; // Impede comportamento padrão
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // 🚀 Limpa listeners ao desmontar a tela
    return () => {
      if (debug) console.log("🛑 Roteador desmontado");
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, rota, debug]);

  return null; // Não renderiza nada na tela
}
