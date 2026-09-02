// Refatoração para usar Bottom Tabs em vez de Drawer Navigator
import { router } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Ícones personalizados
import { Ionicons } from "@expo/vector-icons";
import ModalGlobal from "../components/ModalGlobal";
import Roteador from "../components/VoltaRoteador";
import { ProvedorModal } from "../context/modal/ProvedorModal";
import { ProvedorTarefas } from "../context/tarefas/ProvedorTarefas";

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
            {/* Sistema de abas na parte inferior */}
            <Tabs
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#021123",
                },
                headerTintColor: "#fff",
                tabBarStyle: {
                  backgroundColor: "#021123",
                  borderTopColor: "#144480",
                  borderTopWidth: 2,
                  height: 120,
                  paddingBottom: 10,
                  paddingTop: 10,
                },
                tabBarActiveTintColor: "#B872FF",
                tabBarInactiveTintColor: "#98A0A8",
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: "600",
                },
              }}
            >
              {/* Tela inicial - oculta das abas */}
              <Tabs.Screen
                name="index"
                options={{
                  headerShown: false,
                  tabBarStyle: { display: "none" }, // Oculta as abas na tela inicial
                  href: null, // Remove da navegação por abas
                }}
              />

              {/* Aba Foco (Pomodoro) */}
              <Tabs.Screen
                name="pomodoro"
                options={{
                  title: "Foco",
                  headerShown: false,
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="timer-outline" size={size} color={color} />
                  ),
                }}
              />

              {/* Aba Tarefas */}
              <Tabs.Screen
                name="tarefas/index"
                options={{
                  title: "Tarefas",
                  headerShown: false,
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="list-outline" size={size} color={color} />
                  ),
                }}
              />

              {/* Telas auxiliares - ocultas das abas */}
              <Tabs.Screen
                name="add_tarefa/index"
                options={{
                  href: null, // Remove da navegação por abas
                  title: "Nova Tarefa",
                  headerTitleAlign: "center",
                  headerLeft: () => (
                    <Ionicons
                      name="arrow-back"
                      style={styles.botaoVoltar}
                      onPress={() => router.navigate("../tarefas")}
                    />
                  ),
                }}
              />

              <Tabs.Screen
                name="edit_tarefa/[id]"
                options={{
                  href: null, // Remove da navegação por abas
                  title: "Editar Tarefa",
                  headerTitleAlign: "center",
                  headerLeft: () => (
                    <Ionicons
                      name="arrow-back"
                      style={styles.botaoVoltar}
                      onPress={() => router.navigate("../tarefas")}
                    />
                  ),
                }}
              />
            </Tabs>

            {/* Gerencia rotas do botão nativo das páginas */}
            <Roteador rota="/tarefas" />

            {/* Componentes globais */}
            <ModalGlobal />
          </ProvedorModal>
        </ProvedorTarefas>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  botaoVoltar: {
    fontSize: 24,
    color: "#fff",
    marginLeft: 16,
  },
});
