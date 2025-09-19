// Tipos base
export interface Cidade { id: number; nome: string; prefixo: string; }
export interface Setor {
  updatedAt: string | number | Date; id: number; nome: string; prefixo: string; 
}
export interface Supervisor { id: number; nome: string; email: string; ativo: boolean; }
export interface Responsavel { id: number; nome: string; email: string; ativo: boolean; }
export interface Marca { id: number; nome: string; }
export interface Modelo { id: number; nome: string; marcaId: number; }
export interface Processador { id: number; marca: string; modelo: string; geracao?: string; }
export interface SistemaOperacional { id: number; nome: string; }
export interface SetorCidade { id: number; cidade: Cidade; setor: Setor; supervisor: Supervisor; }

// Tipo principal da Máquina
export interface Maquina {
  id: number;
  tag: string;
  tipo: 'S' | 'D' | 'A' | 'N';
  mac?: string;
  compartilhada: boolean;
  observacoes?: string;
  status: 'DISPONIVEL' | 'EM_USO' | 'EM_MANUTENCAO' | 'DESCARTADO';
  setorCidadeId: number;
  marcaId: number;
  modeloId: number;
  ram_gb: number;
  processadorId: number;
  armazenamento_gb: number;
  tipo_armazenamento: 'SSD' | 'HDD';
  sistemaOperacionalId: number;
  createdAt: string;
  updatedAt: string;
  // Relações
  setorCidade: SetorCidade;
  marca: Marca;
  modelo: Modelo;
  processador: Processador;
  sistemaOperacional: SistemaOperacional;
  responsaveis: { responsavel: Responsavel }[];
}

// Tipos para dados de formulário (omitindo 'id' e relações complexas)
export type CidadeFormData = Omit<Cidade, 'id' | 'createdAt' | 'updatedAt'>;
export type SetorFormData = Omit<Setor, 'id' | 'createdAt' | 'updatedAt'>;
export type SupervisorFormData = Omit<Supervisor, 'id' | 'createdAt' | 'updatedAt'>;
export type ResponsavelFormData = Omit<Responsavel, 'id' | 'createdAt' | 'updatedAt'>;

export type MaquinaFormData = {
  tipo: 'S' | 'D' | 'A' | 'N';
  mac?: string;
  observacoes?: string;
  status: 'DISPONIVEL' | 'EM_USO' | 'EM_MANUTENCAO' | 'DESCARTADO';
  setorCidadeId: number;
  marcaId: number;
  modeloId: number;
  ram_gb: number;
  processadorId: number;
  armazenamento_gb: number;
  tipo_armazenamento: 'SSD' | 'HDD';
  sistemaOperacionalId: number;
};