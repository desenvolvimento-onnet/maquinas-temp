import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSetores, createSetor, updateSetor } from "@/api";
import type { Setor, SetorFormData } from "@/api/types";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "@/components/setores/columns";
import { useState } from "react";
import { SetorDialog } from "@/components/setores/SetorDialog";
import { toast } from "sonner";

export function SetoresPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Setor | null>(null);

  // Busca os dados dos setores na API
  const { data: setores, isLoading, error } = useQuery({
    queryKey: ['setores'],
    queryFn: getSetores,
  });

  // Função genérica de sucesso para as mutações
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['setores'] }); // Invalida o cache para recarregar a tabela
    setDialogOpen(false);
    setEditingSetor(null);
  };

  // Mutação para criar um novo setor
  const createMutation = useMutation({
    mutationFn: createSetor,
    onSuccess: () => {
      handleSuccess();
      toast.success("Setor criado com sucesso!");
    },
    onError: (err) => toast.error(`Falha ao criar setor: ${err.message}`),
  });

  // Mutação para atualizar um setor existente
  const updateMutation = useMutation({
    mutationFn: updateSetor,
    onSuccess: () => {
      handleSuccess();
      toast.success("Setor atualizado com sucesso!");
    },
    onError: (err) => toast.error(`Falha ao atualizar setor: ${err.message}`),
  });

  // Lida com o envio do formulário, decidindo entre criar ou atualizar
  const handleSubmit = (data: SetorFormData) => {
    if (editingSetor) {
      updateMutation.mutate({ id: editingSetor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Carregando setores...</div>;
  if (error) return <div>Ocorreu um erro ao buscar os dados: {error.message}</div>;

  return (
    <div>
      <SetorDialog
        isOpen={isDialogOpen}
        onOpenChange={(isOpen) => {
            if (!isOpen) setEditingSetor(null);
            setDialogOpen(isOpen);
        }}
        onSubmit={handleSubmit}
        initialData={editingSetor}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <DataTable
        columns={columns({
          onEdit: (setor) => {
            setEditingSetor(setor);
            setDialogOpen(true);
          }
        })}
        data={setores || []}
        pageTitle="Gerenciamento de Setores"
        buttonLabel="Adicionar Setor"
        onButtonClick={() => {
          setEditingSetor(null);
          setDialogOpen(true);
        }}
      />
    </div>
  );
}