import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Setor, SetorFormData } from "@/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Validação do formulário com Zod
const formSchema = z.object({
  nome: z.string().min(2, { message: "O nome do setor deve ter pelo menos 2 caracteres." }),
  prefixo: z.string().length(3, { message: "O prefixo deve ter exatamente 3 caracteres." }).transform(val => val.toUpperCase()),
});

type SetorDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: SetorFormData) => void;
  initialData: Setor | null;
  isSubmitting: boolean;
}

export function SetorDialog({ isOpen, onOpenChange, onSubmit, initialData, isSubmitting }: SetorDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", prefixo: "" },
  });

  // Efeito para resetar o formulário quando o modal abre ou os dados mudam
  useEffect(() => {
    if (isOpen && initialData) {
      form.reset(initialData);
    } else if (isOpen) {
      form.reset({ nome: "", prefixo: "" });
    }
  }, [initialData, form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Setor" : "Adicionar Novo Setor"}</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para {initialData ? "atualizar o" : "cadastrar um novo"} setor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Setor</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Tecnologia da Informação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="prefixo" render={({ field }) => (
              <FormItem>
                <FormLabel>Prefixo (3 letras)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: TI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}