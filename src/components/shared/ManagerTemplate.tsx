import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DataTable } from './DataTable';

type ManagerTemplateProps<T, TForm> = {
  queryKey: string;
  queryFn: () => Promise<T[]>;
  createFn: (data: TForm) => Promise<T>;
  updateFn: (params: { id: number, data: TForm }) => Promise<T>;
  columns: any; // Simplified for brevity
  DialogComponent: React.ElementType;
  pageTitle: string;
  buttonLabel: string;
}

export function ManagerTemplate<T extends { id: number }, TForm>({
  queryKey, queryFn, createFn, updateFn, columns, DialogComponent, pageTitle, buttonLabel
}: ManagerTemplateProps<T, TForm>) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const { data, isLoading, error } = useQuery({ queryKey: [queryKey], queryFn });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    setDialogOpen(false);
    setEditingItem(null);
  };

  const createMutation = useMutation({
    mutationFn: createFn,
    onSuccess: () => { handleSuccess(); toast.success(`${pageTitle.slice(0,-1)} criado com sucesso!`); },
    onError: () => toast.error(`Falha ao criar ${pageTitle.slice(0,-1).toLowerCase()}.`),
  });

  const updateMutation = useMutation({
    mutationFn: updateFn,
    onSuccess: () => { handleSuccess(); toast.success(`${pageTitle.slice(0,-1)} atualizado com sucesso!`); },
    onError: () => toast.error(`Falha ao atualizar ${pageTitle.slice(0,-1).toLowerCase()}.`),
  });

  const handleSubmit = (formData: TForm) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const memoizedColumns = useMemo(() => columns({ onEdit: (item: T) => { setEditingItem(item); setDialogOpen(true); } }), [columns]);
  
  if (isLoading) return <div>Carregando {pageTitle}...</div>;
  if (error) return <div>Ocorreu um erro.</div>;

  return (
    <>
      <DialogComponent
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={editingItem}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <DataTable
        columns={memoizedColumns}
        data={data || []}
        pageTitle={pageTitle}
        buttonLabel={buttonLabel}
        onButtonClick={() => { setEditingItem(null); setDialogOpen(true); }}
      />
    </>
  );
}