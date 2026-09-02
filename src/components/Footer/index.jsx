import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, espaco, fonte } from "@/theme";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Projeto fictício e sem fins comerciais
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
