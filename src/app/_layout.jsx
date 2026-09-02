// Stack na raiz. As abas são a primeira tela da pilha; as demais empilham por cima.
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProvedorTarefas } from "../context/tarefas/ProvedorTarefas";
import ModalGlobal from "../components/ModalGlobal";
import { ProvedorModal } from "../context/modal/ProvedorModal";

/* 
Organização dos contextos:
1 - Contextos de dados (tarefas, usuários, pedidos).                 
2 - Contextos de interface (modais).
3 - Contextos de tema, config, autenticação.
*/

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#021123" }}>
      <SafeAreaProvider>
        <ProvedorTarefas>
          <ProvedorModal>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: "#021123" },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                contentStyle: { backgroundColor: "#021123" },
              }}
            >
              {/* Tela inicial — fora das abas, sem header */}
              <Stack.Screen name="index" options={{ headerShown: false }} />

              {/* As abas inteiras são uma única tela da pilha */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* Telas que empilham por cima das abas */}
              <Stack.Screen
                name="add_tarefa/index"
                options={{ title: "Nova Tarefa" }}
              />

              <Stack.Screen
                name="edit_tarefa/[id]"
                options={{ title: "Editar Tarefa" }}
              />
            </Stack>

            {/* Componentes globais */}
            <ModalGlobal />
          </ProvedorModal>
        </ProvedorTarefas>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
