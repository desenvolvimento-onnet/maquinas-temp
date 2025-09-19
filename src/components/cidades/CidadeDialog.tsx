import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Cidade, CidadeFormData } from "@/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const formSchema = z.object({
  nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  prefixo: z.string().length(3, { message: "O prefixo deve ter exatamente 3 caracteres." }).transform(val => val.toUpperCase()),
});

type CidadeDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: CidadeFormData) => void;
  initialData: Cidade | null;
  isSubmitting: boolean;
}

export function CidadeDialog({ isOpen, onOpenChange, onSubmit, initialData, isSubmitting }: CidadeDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", prefixo: "" },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({ nome: "", prefixo: "" });
    }
  }, [initialData, form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Cidade" : "Adicionar Nova Cidade"}</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para {initialData ? "atualizar a" : "cadastrar uma nova"} cidade.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Ex: Patrocínio" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="prefixo" render={({ field }) => (
              <FormItem><FormLabel>Prefixo</FormLabel><FormControl><Input placeholder="Ex: PTC" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}