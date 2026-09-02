import { createContext, useEffect, useState } from "react";
// Atencao so sabe usar string
import AsyncStorage from "@react-native-async-storage/async-storage";
// Criação do contexto das tarefas
export const TaskContext = createContext();
const TAREFAS_STOREGE_KEY = "foco-tarefas";
// Componente provedor que disponibiliza o contexto para os filhos
export function ProvedorTarefas({ children }) {
  const [tarefas, setTarefas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega os dados salvos no armazenamento local (AsyncStorage) assim que o componente for montado
  useEffect(() => {
    const getData = async () => {
      const jsonValue = await AsyncStorage.getItem(TAREFAS_STOREGE_KEY); // Recupera os dados salvos
      const loadData = jsonValue != null ? JSON.parse(jsonValue) : []; // Converte de JSON para array ou inicia vazio
      setTarefas(loadData); // Atualiza o estado com os dados recuperados
      setIsLoaded(true); // Marca como carregado para permitir persistência futura
    };
    getData();
  }, []); // Executa apenas uma vez ao montar o componente

  // Função para salvar os dados no armazenamento local
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value); // Converte o array de tarefas para JSON
      await AsyncStorage.setItem(TAREFAS_STOREGE_KEY, jsonValue); // Salva no AsyncStorage
    } catch (e) {
      // Erro ao salvar os dados (pode-se exibir um alerta ou log se desejar)
    }
  };

  // Salva automaticamente as tarefas sempre que elas forem modificadas, após o carregamento inicial
  useEffect(() => {
    if (isLoaded) {
      storeData(tarefas); // Persistência automática das alterações
    }
  }, [tarefas]); // Dispara sempre que o estado `tarefas` mudar

  // Adiciona uma nova tarefa com descrição e ID único
  const addTarefa = (descricao) => {
    setTarefas((prev) => [
      ...prev,
      {
        id: Date.now() + Math.floor(Math.random() * 1000), //Gera um ID único
        descricao: descricao,
        completed: false, // Inicia como tarefa não concluída
      },
    ]);
  };

  // Alterna o status de conclusão da tarefa com base no ID
  const completarTarefa = (id) => {
    setTarefas((prev) => {
      return prev.map((t) => {
        if (t.id === id) {
          t.completed = !t.completed;
        }
        return t;
      });
    });
  };

  // Remove uma tarefa da lista com base no ID
  const deletarTarefa = (id) => {
    setTarefas((prev) => prev.filter((tarefa) => tarefa.id !== id));
  };

  // Editar uma tarefa
  const editarTarefa = (id, descricao) => {
    setTarefas((prev) =>
      prev.map(
        (tarefa) =>
          tarefa.id === id
            ? { ...tarefa, descricao: descricao } // altera só a descrição
            : tarefa // mantém as outras tarefas
      )
    );
  };

  return (
    // Fornece o contexto para os componentes filhos
    <TaskContext.Provider
      value={{
        tarefas, // Lista de tarefas
        addTarefa, // Função para adicionar tarefa
        completarTarefa, // Função para alternar status de conclusão
        deletarTarefa, // Função para remover tarefa
        editarTarefa, // Editar tarefa
      }}
    >
      {/* Renderiza os componentes filhos dentro do provedor */}
      {children}
    </TaskContext.Provider>
  );
}
