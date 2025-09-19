import { apiClient } from './client';
import { 
  Cidade, Maquina, Responsavel, Setor, Supervisor, Marca, Modelo, 
  Processador, SistemaOperacional, SetorCidade, MaquinaFormData
} from './types';
// Generic function to fetch all items of a certain type
const getAll = <T>(endpoint: string) => async (): Promise<T[]> => {
  const response = await apiClient.get(`/${endpoint}`);
  return response.data;
};

// Generic function to create an item
const createItem = <T>(endpoint: string) => async (data: Partial<T>): Promise<T> => {
  const response = await apiClient.post(`/${endpoint}`, data);
  return response.data;
};

// Generic function to update an item
const updateItem = <T>(endpoint: string) => async ({ id, data }: { id: number, data: Partial<T> }): Promise<T> => {
  const response = await apiClient.put(`/${endpoint}/${id}`, data);
  return response.data;
};

// Export specific API functions
export const getMaquinas = getAll<Maquina>('maquinas');
export const createMaquina = createItem<Maquina>('maquinas');
export const updateMaquina = updateItem<Maquina>('maquinas');

export const getMarcas = getAll<Marca>('specs/marcas');
export const getModelos = getAll<Modelo>('specs/modelos');
export const getProcessadores = getAll<Processador>('specs/processadores');
export const getSOs = getAll<SistemaOperacional>('specs/sistemas-operacionais');
export const getSetoresCidades = getAll<SetorCidade>('setor-cidade');

export const getCidades = getAll<Cidade>('cidades');
export const getSetores = getAll<Setor>('setores');
export const getSupervisores = getAll<Supervisor>('supervisores');
export const getResponsaveis = getAll<Responsavel>('responsaveis');

export const createCidade = createItem<Cidade>('cidades');
export const updateCidade = updateItem<Cidade>('cidades');

export const createSetor = createItem<Setor>('setores');
export const updateSetor = updateItem<Setor>('setores');

export const createSupervisor = createItem<Supervisor>('supervisores');
export const updateSupervisor = updateItem<Supervisor>('supervisores');

export const createResponsavel = createItem<Responsavel>('responsaveis');
export const updateResponsavel = updateItem<Responsavel>('responsaveis');