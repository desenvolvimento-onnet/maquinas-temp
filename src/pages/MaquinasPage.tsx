import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaquinas, createMaquina, updateMaquina } from "@/api";
import type { Maquina, MaquinaFormData } from "@/api/types";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "@/components/maquinas/columns";
import { useState } from "react";
import { MaquinaDialog } from "@/components/maquinas/MaquinaDialog";
import { toast } from "sonner";

export function MaquinasPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingMaquina, setEditingMaquina] = useState<Maquina | null>(null);

  const { data: maquinas, isLoading, error } = useQuery({
    queryKey: ['maquinas'],
    queryFn: getMaquinas,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['maquinas'] });
    setDialogOpen(false);
    setEditingMaquina(null);
  };

  const createMutation = useMutation({
    mutationFn: createMaquina,
    onSuccess: () => {
      handleSuccess();
      toast.success("Máquina criada com sucesso!");
    },
    onError: (err) => toast.error(`Falha ao criar máquina: ${err.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: updateMaquina,
    onSuccess: () => {
      handleSuccess();
      toast.success("Máquina atualizada com sucesso!");
    },
    onError: (err) => toast.error(`Falha ao atualizar máquina: ${err.message}`),
  });

  const handleSubmit = (data: MaquinaFormData) => {
    if (editingMaquina) {
      updateMutation.mutate({ id: editingMaquina.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Carregando máquinas...</div>;
  if (error) return <div>Ocorreu um erro: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <MaquinaDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingMaquina}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <DataTable
        columns={columns({ onEdit: (maquina:Maquina) => { setEditingMaquina(maquina); setDialogOpen(true); } })}
        data={maquinas || []}
        pageTitle="Gerenciamento de Máquinas"
        buttonLabel="Adicionar Máquina"
        onButtonClick={() => { setEditingMaquina(null); setDialogOpen(true); }}
      />
    </div>
  );
}