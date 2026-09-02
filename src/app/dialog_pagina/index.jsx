import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import useContextoNotificacao from "../../context/notificacao/useContextoNotificacao";
import useModal from "../../context/modal/useModal";
export default function DialogTestPage() {
  const { showNotificacao } = useContextoNotificacao();
  const { confirmar, carregando, fechar } = useModal();

  const abrirNotificacao = (tipo) => {
    switch (tipo) {
      case "excluir":
        showNotificacao({
          tipo: "excluir",
          titulo: "Excluir Tarefa",
          mensagem: "Tem certeza que deseja excluir essa tarefa?",
        });
        break;

      case "sucesso":
        showNotificacao({
          tipo: "sucesso",
          titulo: "Sucesso!",
          mensagem: "Tarefa adicionada com sucesso!",
        });
        break;

      case "alerta":
        showNotificacao({
          tipo: "alerta",
          titulo: "Atenção",
          mensagem: "Ocorreu um erro. Tente novamente.",
        });
        break;

      case "info":
        showNotificacao({
          tipo: "info",
          titulo: "Informação",
          mensagem: "Isso é apenas uma informação qualquer.",
        });
        break;

      default:
        break;
    }
  };

  const excluirTarefa = async () => {
    const resp = await confirmar({
      titulo: "Deseja excluir?",
      mensagem: "Essa ação não poderá ser desfeita.",
    });

    if (resp) {
      carregando({ titulo: "Excluindo...", mensagem: "Por favor, aguarde." });
      await new Promise((r) => setTimeout(r, 3000)); // Simula processo
      fechar();
      console.log("Excluído com sucesso!");
    } else {
      console.log("Cancelado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Testando Notificações (Toast/Notificação)
      </Text>

      <View style={styles.botoes}>
        <Pressable
          style={[styles.botao, { backgroundColor: "rgb(194, 116, 0)" }]}
          onPress={excluirTarefa}
        >
          <Text style={styles.textoBotao}>Acao Modal</Text>
        </Pressable>
        <Pressable
          style={[styles.botao, { backgroundColor: "#dc3545" }]}
          onPress={() => abrirNotificacao("excluir")}
        >
          <Text style={styles.textoBotao}>Excluir</Text>
        </Pressable>

        <Pressable
          style={[styles.botao, { backgroundColor: "#28a745" }]}
          onPress={() => abrirNotificacao("sucesso")}
        >
          <Text style={styles.textoBotao}>Sucesso</Text>
        </Pressable>

        <Pressable
          style={[styles.botao, { backgroundColor: "#ffc107" }]}
          onPress={() => abrirNotificacao("alerta")}
        >
          <Text style={styles.textoBotao}>Erro/Aviso</Text>
        </Pressable>

        <Pressable
          style={[styles.botao, { backgroundColor: "#007bff" }]}
          onPress={() => abrirNotificacao("info")}
        >
          <Text style={styles.textoBotao}>Info</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#021123",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "bold",
  },
  botoes: {
    gap: 12,
    width: "100%",
  },
  botao: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    width: "80%",
    alignItems: "center",
    gap: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mensagem: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  acoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  botaoPrimario: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoPrimario: {
    color: "#fff",
    fontWeight: "600",
  },
  botaoSecundario: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  textoSecundario: {
    color: "#000",
    fontWeight: "600",
  },
});
