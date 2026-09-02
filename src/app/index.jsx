import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { router } from "expo-router";
import Img_Logo from "../assets/images/Fokus -  logo-02 1.png";
import Img_TelaInicial from "../assets/images/Imagem tela inicial.png";
import Footer from "../components/Footer";
import FocoBotao from "@/components/FocoBotao";
export default function Index() {
  return (
    // Exibi só na area segura
    <SafeAreaView style={styles.container}>
      <Image source={Img_Logo} />
      <View style={styles.inner}>
        <Text style={styles.texto}>
          Otimize sua{"\n"} produtividade,{"\n"}
          <Text style={styles.bold}>mergulhe no que{"\n"} importa</Text>
        </Text>
        <Image
          source={Img_TelaInicial}
          style={[styles.imagem, { resizeMode: "contain" }]}
        />

        {/* Botao de iniciar o aplicativo */}
        <FocoBotao
          titulo={"Quero iniciar!"}
          // onPress={() => router.push("/pomodoro")} // volta na pilha de tela
          onPress={() => router.replace("/pomodoro")} // reseta a pilha de tela
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
    backgroundColor: "#021123",
    gap: 40,
  },
  inner: {
    gap: 16,
  },
  texto: {
    color: "#fff",
    fontSize: 26,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  imagem: {
    width: 300,
    height: 300,
    padding: 10,
  },
  botao: {
    backgroundColor: "#B872FF",
    borderRadius: 32,
    padding: 8,
  },
  botaoText: {
    color: "#021123",
    fontSize: 18,
    textAlign: "center",
  },
});
