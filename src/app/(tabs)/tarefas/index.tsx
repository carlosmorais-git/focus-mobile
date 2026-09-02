import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import useContextoTarefa from "../../../context/tarefas/ProvedorTarefas";
import TarefaItem from "../../../components/TarefaItem";
import FocoBotao from "../../../components/FocoBotao";
import { IconPlus } from "../../../components/Icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores, espaco, fonte } from "@/theme";

export default function Tarefas() {
  const { tarefas, deletarTarefa, completarTarefa } = useContextoTarefa();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.texto}>Lista de Tarefas:</Text>

        {/* FlatList DIRETO com flex */}
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id.toString()}
          style={{
            flexGrow: 0,
          }} // ← pode remover se quiser scroll natural
          initialNumToRender={10} //O FlatList começa renderizando 10 itens;
          maxToRenderPerBatch={5} //A cada rolagem, renderiza 5 a mais por lote;
          windowSize={5} //Mantém apenas uma janela de 5 telas em volta do que está visível (e libera o restante da memória).
          renderItem={({ item }) => (
            <TarefaItem
              completed={item.completed}
              texto={item.descricao}
              onPressDelete={() => deletarTarefa(item.id)}
              onTarefaCompleta={() => completarTarefa(item.id)}
              onPressEdit={() => router.push(`/edit_tarefa/${item.id}`)} // pegar o id
            />
          )}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>
              Nenhuma tarefa ainda. Crie a primeira!
            </Text>
          }
        />
      </View>
      <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
        <FocoBotao
          titulo={"Adicionar nova tarefa"}
          img={<IconPlus />}
          onPress={() => router.push("/add_tarefa")}
          outline
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: "center",
  },
  wrapper: {
    flex: 0.95, // ← ESSENCIAL
    width: "90%",
    gap: espaco.gigante,
    paddingTop: espaco.xl,
  },
  texto: {
    fontSize: fonte.titulo,
    color: cores.texto,
    textAlign: "center",
  },
  textoVazio: {
    textAlign: "center",
    marginTop: espaco.xl,
    color: cores.textoVazio,
  },
});
