import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Maquina } from "@/api/types";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarcas, getModelos, getProcessadores, getSOs, getSetoresCidades } from "@/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

// Schema SEM coerce - todos os campos como string
const formSchema = z.object({
  tipo: z.enum(['S', 'D', 'A', 'N']),
  mac: z.string().optional(),
  observacoes: z.string().optional(),
  status: z.enum(['DISPONIVEL', 'EM_USO', 'EM_MANUTENCAO', 'DESCARTADO']),
  setorCidadeId: z.string().min(1, "Campo obrigatório"),
  marcaId: z.string().min(1, "Campo obrigatório"),
  modeloId: z.string().min(1, "Campo obrigatório"),
  ram_gb: z.string().min(1, "Campo obrigatório"),
  processadorId: z.string().min(1, "Campo obrigatório"),
  armazenamento_gb: z.string().min(1, "Campo obrigatório"),
  tipo_armazenamento: z.enum(['SSD', 'HDD']),
  sistemaOperacionalId: z.string().min(1, "Campo obrigatório"),
});

// Tipo de entrada (todos strings)
type MaquinaFormInput = z.infer<typeof formSchema>;

// Tipo de saída (com numbers)
type MaquinaFormValues = {
  tipo: "S" | "D" | "A" | "N";
  status: "DISPONIVEL" | "EM_USO" | "EM_MANUTENCAO" | "DESCARTADO";
  setorCidadeId: number;
  marcaId: number;
  modeloId: number;
  ram_gb: number;
  processadorId: number;
  armazenamento_gb: number;
  tipo_armazenamento: "SSD" | "HDD";
  sistemaOperacionalId: number;
  mac?: string;
  observacoes?: string;
};

type DialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: MaquinaFormValues) => void;
  initialData: Maquina | null;
  isSubmitting: boolean;
}

// Valores padrão como strings
const defaultFormValues: MaquinaFormInput = {
  tipo: 'N',
  status: 'DISPONIVEL',
  tipo_armazenamento: 'SSD',
  mac: '',
  observacoes: '',
  setorCidadeId: '1',
  marcaId: '1',
  modeloId: '1',
  ram_gb: '8',
  processadorId: '1',
  armazenamento_gb: '256',
  sistemaOperacionalId: '1',
};

export function MaquinaDialog({ isOpen, onOpenChange, onSubmit, initialData, isSubmitting }: DialogProps) {
  const marcasQuery = useQuery({ queryKey: ['marcas'], queryFn: getMarcas });
  const modelosQuery = useQuery({ queryKey: ['modelos'], queryFn: getModelos });
  const processadoresQuery = useQuery({ queryKey: ['processadores'], queryFn: getProcessadores });
  const sosQuery = useQuery({ queryKey: ['SOs'], queryFn: getSOs });
  const setoresCidadesQuery = useQuery({ queryKey: ['setoresCidades'], queryFn: getSetoresCidades });

  const isFormDataLoading = marcasQuery.isLoading || modelosQuery.isLoading || processadoresQuery.isLoading || sosQuery.isLoading || setoresCidadesQuery.isLoading;

  // useForm com tipo de entrada (strings)
  const form = useForm<MaquinaFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // Função para converter de string para number
  const convertToNumbers = (data: MaquinaFormInput): MaquinaFormValues => ({
    ...data,
    setorCidadeId: Number(data.setorCidadeId),
    marcaId: Number(data.marcaId),
    modeloId: Number(data.modeloId),
    ram_gb: Number(data.ram_gb),
    processadorId: Number(data.processadorId),
    armazenamento_gb: Number(data.armazenamento_gb),
    sistemaOperacionalId: Number(data.sistemaOperacionalId),
  });

  // Wrapper para o onSubmit
  const handleSubmit: SubmitHandler<MaquinaFormInput> = (data) => {
    const convertedData = convertToNumbers(data);
    onSubmit(convertedData);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const mappedInitialData: MaquinaFormInput = {
          tipo: initialData.tipo,
          mac: initialData.mac || '',
          observacoes: initialData.observacoes || '',
          status: initialData.status,
          setorCidadeId: String(initialData.setorCidadeId),
          marcaId: String(initialData.marcaId),
          modeloId: String(initialData.modeloId),
          ram_gb: String(initialData.ram_gb),
          processadorId: String(initialData.processadorId),
          armazenamento_gb: String(initialData.armazenamento_gb),
          tipo_armazenamento: initialData.tipo_armazenamento,
          sistemaOperacionalId: String(initialData.sistemaOperacionalId),
        };
        form.reset(mappedInitialData);
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [initialData, isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Máquina" : "Adicionar Nova Máquina"}</DialogTitle>
          <DialogDescription>Preencha todos os campos para registrar a máquina.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto p-4">
            
            <FormField 
              control={form.control} 
              name="setorCidadeId" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização (Cidade/Setor)</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {setoresCidadesQuery.data?.map(sc => (
                        <SelectItem key={sc.id} value={String(sc.id)}>
                          {sc.cidade.nome} / {sc.setor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="marcaId" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {marcasQuery.data?.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="modeloId" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modelosQuery.data?.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="processadorId" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processador</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {processadoresQuery.data?.map(p => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {`${p.marca} ${p.modelo} ${p.geracao || ''}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="sistemaOperacionalId" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Operacional</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sosQuery.data?.map(so => (
                        <SelectItem key={so.id} value={String(so.id)}>
                          {so.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="ram_gb" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RAM (GB)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="armazenamento_gb" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Armazenamento (GB)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="tipo" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="N">Notebook</SelectItem>
                      <SelectItem value="D">Desktop</SelectItem>
                      <SelectItem value="A">All in One</SelectItem>
                      <SelectItem value="S">Smartphone</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="tipo_armazenamento" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Armazenamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SSD">SSD</SelectItem>
                      <SelectItem value="HDD">HDD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="status" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                      <SelectItem value="EM_USO">Em Uso</SelectItem>
                      <SelectItem value="EM_MANUTENCAO">Em Manutenção</SelectItem>
                      <SelectItem value="DESCARTADO">Descartado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="mac" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço MAC (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00:1B:44:11:3A:B7" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <FormField 
              control={form.control} 
              name="observacoes" 
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhes sobre a máquina..." 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting || isFormDataLoading}>
                {isFormDataLoading ? "Carregando dados..." : isSubmitting ? "Salvando..." : "Salvar Máquina"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}