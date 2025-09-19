import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCidades, createCidade, updateCidade } from "@/api";
import type { Cidade, CidadeFormData } from "@/api/types";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "@/components/cidades/columns";
import { useState } from "react";
import { CidadeDialog } from "@/components/cidades/CidadeDialog";
import { toast } from "sonner";

export function CidadesPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingCidade, setEditingCidade] = useState<Cidade | null>(null);

  const { data: cidades, isLoading, error } = useQuery({
    queryKey: ['cidades'],
    queryFn: getCidades,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['cidades'] });
    setDialogOpen(false);
    setEditingCidade(null);
  };

  const createMutation = useMutation({
    mutationFn: createCidade,
    onSuccess: () => {
      handleSuccess();
      toast.success("Cidade criada com sucesso!");
    },
    onError: () => toast.error("Falha ao criar cidade."),
  });

  const updateMutation = useMutation({
    mutationFn: updateCidade,
    onSuccess: () => {
      handleSuccess();
      toast.success("Cidade atualizada com sucesso!");
    },
    onError: () => toast.error("Falha ao atualizar cidade."),
  });

  const handleSubmit = (data: CidadeFormData) => {
    if (editingCidade) {
      updateMutation.mutate({ id: editingCidade.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Ocorreu um erro: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <CidadeDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingCidade}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <DataTable
        columns={columns({ onEdit: setEditingCidade, onOpenDialog: setDialogOpen })}
        data={cidades || []}
        pageTitle="Cidades"
        buttonLabel="Adicionar Cidade"
        onButtonClick={() => { setEditingCidade(null); setDialogOpen(true); }}
      />
    </div>
  );
}