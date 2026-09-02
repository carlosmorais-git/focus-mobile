import { useEffect } from "react";
import { useNavigation, router } from "expo-router";
import { BackHandler } from "react-native";

/**
 * 🔥 Componente utilitário para sobrescrever o botão nativo de voltar.
 *
 * Monte por TELA, nunca no _layout raiz: ele cancela o `beforeRemove` do
 * navegador, então na raiz bloquearia o voltar de todas as telas do Stack.
 *
 * Usa `replace` e não `push` — `push` empilharia a rota de destino por cima,
 * fazendo a pilha crescer a cada voltar em vez de encolher.
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
      router.replace(rota);
    });

    // 🔹 Intercepta botão físico do Android
    const backAction = () => {
      if (debug) console.log("🔹 Evento: Botão físico Back");
      router.replace(rota);
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
