import { getSupervisores, createSupervisor, updateSupervisor, getResponsaveis, createResponsavel, updateResponsavel } from "@/api";
import { supervisorColumns } from "@/components/supervisores/columns";
import { SupervisorDialog } from "@/components/supervisores/SupervisorDialog";
import { responsavelColumns } from "@/components/responsaveis/columns";
import { ResponsavelDialog } from "@/components/responsaveis/ResponsavelDialog";
import { ManagerTemplate } from "@/components/shared/ManagerTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PessoasPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Pessoas</h1>
      <Tabs defaultValue="supervisores">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="supervisores">Supervisores</TabsTrigger>
          <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
        </TabsList>
        <TabsContent value="supervisores">
          <Card>
            <CardContent className="pt-6">
              <ManagerTemplate
                queryKey="supervisores"
                queryFn={getSupervisores}
                createFn={createSupervisor}
                updateFn={updateSupervisor}
                columns={supervisorColumns}
                DialogComponent={SupervisorDialog}
                pageTitle="Supervisores"
                buttonLabel="Adicionar Supervisor"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="responsaveis">
          <Card>
            <CardContent className="pt-6">
              <ManagerTemplate
                queryKey="responsaveis"
                queryFn={getResponsaveis}
                createFn={createResponsavel}
                updateFn={updateResponsavel}
                columns={responsavelColumns}
                DialogComponent={ResponsavelDialog}
                pageTitle="Responsáveis"
                buttonLabel="Adicionar Responsável"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}