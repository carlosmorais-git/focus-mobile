// Bottom Tabs — só as duas telas principais.
// Este grupo inteiro é UMA tela dentro do Stack raiz (ver ../_layout.jsx).
// O parêntese em "(tabs)" marca um grupo de rotas: não entra na URL,
// então as rotas continuam sendo /pomodoro e /tarefas.
import { Tabs } from "expo-router/js-tabs";
import { Ionicons } from "@expo/vector-icons";
import { cores, espaco, fonte } from "@/theme";

export default function LayoutTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cores.fundo,
          borderTopColor: cores.borda,
          borderTopWidth: 2,
          height: 120,
          paddingBottom: espaco.sm,
          paddingTop: espaco.sm,
        },
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarLabelStyle: {
          fontSize: fonte.xs,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="pomodoro"
        options={{
          title: "Foco",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tarefas/index"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
