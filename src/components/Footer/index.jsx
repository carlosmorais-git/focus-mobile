import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Projeto fictício e sem fins comerciais
      </Text>
      <Text style={styles.footerText}>Desenvolvido por Alura</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    bottom: 0,
    width: "80%",
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#98A0A8",
    fontSize: 14,
  },
});
