import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** Uma tarefa da lista. `id` também é chave de rota em `edit_tarefa/[id]`. */
export type Tarefa = {
  id: number;
  descricao: string;
  completed: boolean;
};

type ContextoTarefa = {
  tarefas: Tarefa[];
  /** Última falha de gravação no AsyncStorage, ou `null` se tudo persistiu. */
  erroPersistencia: unknown;
  addTarefa: (descricao: string) => void;
  completarTarefa: (id: number) => void;
  deletarTarefa: (id: number) => void;
  editarTarefa: (id: number, descricao: string) => void;
};

// Criação do contexto das tarefas
export const TaskContext = createContext<ContextoTarefa | null>(null);
const TAREFAS_STOREGE_KEY = "foco-tarefas";

// Componente provedor que disponibiliza o contexto para os filhos
export function ProvedorTarefas({ children }: { children: ReactNode }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // Guarda a última falha de gravação. null = tudo persistido.
  const [erroPersistencia, setErroPersistencia] = useState<unknown>(null);

  // Carrega os dados salvos no armazenamento local (AsyncStorage) assim que o componente for montado
  useEffect(() => {
    const getData = async () => {
      const jsonValue = await AsyncStorage.getItem(TAREFAS_STOREGE_KEY); // Recupera os dados salvos
      // O que sai do AsyncStorage é string: o cast é a fronteira entre dado cru e tipado
      const loadData: Tarefa[] = jsonValue != null ? JSON.parse(jsonValue) : [];
      setTarefas(loadData); // Atualiza o estado com os dados recuperados
      setIsLoaded(true); // Marca como carregado para permitir persistência futura
    };
    getData();
  }, []); // Executa apenas uma vez ao montar o componente

  // Função para salvar os dados no armazenamento local
  const storeData = async (value: Tarefa[]) => {
    const jsonValue = JSON.stringify(value); // Converte o array de tarefas para JSON
    await AsyncStorage.setItem(TAREFAS_STOREGE_KEY, jsonValue); // Salva no AsyncStorage
  };

  // Salva automaticamente as tarefas sempre que elas forem modificadas, após o carregamento inicial
  useEffect(() => {
    if (!isLoaded) return; // Não grava antes do load inicial terminar

    let ativo = true; // Evita atualizar estado depois de desmontar

    storeData(tarefas)
      .then(() => {
        if (ativo) setErroPersistencia(null); // Gravou: limpa a falha anterior
      })
      .catch((erro: unknown) => {
        // Sem isso a tarefa some no próximo boot e ninguém fica sabendo
        console.error("Falha ao salvar as tarefas no AsyncStorage", erro);
        if (ativo) setErroPersistencia(erro);
      });

    return () => {
      ativo = false;
    };
  }, [tarefas, isLoaded]); // Dispara sempre que o estado `tarefas` mudar

  // Adiciona uma nova tarefa com descrição e ID único
  const addTarefa = (descricao: string) => {
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
  const completarTarefa = (id: number) => {
    setTarefas((prev) =>
      prev.map(
        (tarefa) =>
          tarefa.id === id
            ? { ...tarefa, completed: !tarefa.completed } // alterna só a conclusão
            : tarefa // mantém as outras tarefas
      )
    );
  };

  // Remove uma tarefa da lista com base no ID
  const deletarTarefa = (id: number) => {
    setTarefas((prev) => prev.filter((tarefa) => tarefa.id !== id));
  };

  // Editar uma tarefa
  const editarTarefa = (id: number, descricao: string) => {
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
        erroPersistencia, // Última falha de gravação, ou null
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

/** Acessa o contexto de tarefas. Lança se usado fora do ProvedorTarefas. */
export default function useContextoTarefa(): ContextoTarefa {
  const contexto = useContext(TaskContext);

  if (!contexto) {
    throw new Error(
      "useContextoTarefa deve ser usado dentro do ProvedorTarefas."
    );
  }

  return contexto;
}
