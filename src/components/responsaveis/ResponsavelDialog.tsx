import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Responsavel } from "@/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório."),
  email: z.string().email("Formato de email inválido."),
  ativo: z.boolean(), // Sem default, sempre obrigatório
});

type FormData = z.infer<typeof formSchema>;

type DialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: FormData) => void;
  initialData: Responsavel | null;
  isSubmitting: boolean;
}

export function ResponsavelDialog({ isOpen, onOpenChange, onSubmit, initialData, isSubmitting }: DialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      nome: "", 
      email: "", 
      ativo: true // Valor padrão no defaultValues, não no schema
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nome: initialData.nome || "",
        email: initialData.email || "",
        ativo: initialData.ativo ?? true, // Garante que seja sempre boolean
      });
    } else {
      form.reset({ nome: "", email: "", ativo: true });
    }
  }, [initialData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Responsável" : "Novo Responsável"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField 
              control={form.control} 
              name="nome" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
              control={form.control} 
              name="email" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
              control={form.control} 
              name="ativo" 
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )} 
            />
            <div className="flex justify-end pt-4">
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