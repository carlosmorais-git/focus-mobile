import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
const AbasModo = ({ modoAtivo, mudarModo, valueDic }) => {
  return (
    <>
      {/* Vou mapear os modos */}
      {valueDic.map((item, index) => (
        // Pressable é um componente que permite interações de toque
        // Ele é usado para criar botões ou áreas interativas
        <Pressable
          key={item.id}
          style={modoAtivo.id === item.id ? styles.textoModoAtivo : null}
          onPress={() => mudarModo(valueDic[index])}
        >
          <Text style={styles.textModo}>{item.name}</Text>
        </Pressable>
      ))}
    </>
  );
};

export default AbasModo;

const styles = StyleSheet.create({
  textModo: {
    color: "#fff",
    fontSize: 12.5,
    padding: 8,
  },
  textoModoAtivo: {
    backgroundColor: "#144480",
    borderRadius: 8,
  },
});
