import { apiClient } from './client';

// Tipagem para a Máquina (pode ser mais detalhada)
export interface Maquina {
  id: number;
  tag: string;
  tipo: string;
  compartilhada: boolean;
  status: string;
  setorCidade: {
    cidade: { nome: string };
    setor: { nome: string };
  };
  responsaveis: { responsavel: { nome: string } }[];
  // Adicione outros campos conforme necessário
}

export const getMaquinas = async (): Promise<Maquina[]> => {
  const response = await apiClient.get('/maquinas');
  return response.data;
};

// Adicione outras funções aqui: createMaquina, updateMaquina, etc.