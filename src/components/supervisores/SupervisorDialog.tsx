import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Supervisor } from "@/api/types";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

// 1. Definir o schema de entrada (sem defaults)
const supervisorInputSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório."),
  email: z.string().email("Formato de email inválido."),
  ativo: z.boolean().optional(), // Pode ser undefined
});

// 2. Transformar para o schema de saída (com defaults)
export const supervisorFormSchema = supervisorInputSchema.transform((data) => ({
  nome: data.nome,
  email: data.email,
  ativo: data.ativo ?? true, // Garante que sempre tenha um valor
}));

// 3. Tipos explícitos para entrada e saída
export type SupervisorFormInput = z.input<typeof supervisorInputSchema>;
export type SupervisorFormValues = z.output<typeof supervisorFormSchema>;

// 4. Props do Dialog
type DialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: SubmitHandler<SupervisorFormInput>; // Usa o tipo de entrada
  initialData: Supervisor | null;
  isSubmitting: boolean;
};

export function SupervisorDialog({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isSubmitting 
}: DialogProps) {
  
  // 5. useForm com o tipo de entrada
  const form = useForm<SupervisorFormInput>({
    resolver: zodResolver(supervisorInputSchema), // Usa o schema de entrada
    defaultValues: {
      nome: "",
      email: "",
      ativo: true, // Mesmo que seja optional, podemos definir
    } as SupervisorFormInput,
  });

  // 6. useEffect para resetar o form
  useEffect(() => {
    if (initialData) {
      // Mapeia os dados do Supervisor para o formato de entrada
      const formData: SupervisorFormInput = {
        nome: initialData.nome || "",
        email: initialData.email || "",
        ativo: initialData.ativo, // Pode ser undefined
      };
      form.reset(formData);
    } else {
      // Reset para valores padrão
      form.reset({
        nome: "",
        email: "",
        ativo: true,
      } as SupervisorFormInput);
    }
  }, [initialData, form]);

  // 7. Wrapper para o onSubmit que transforma os dados
  const handleSubmit = async (data: SupervisorFormInput) => {
    // O zodResolver já vai aplicar a transformação para SupervisorFormValues
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Supervisor" : "Novo Supervisor"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

            {/* Campo ativo sempre visível para consistência */}
            <FormField 
              control={form.control} 
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Supervisor ativo" : "Supervisor inativo"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value ?? true} // Fallback para true
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }} 
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