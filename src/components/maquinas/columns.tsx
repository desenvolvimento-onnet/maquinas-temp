import type { ColumnDef } from "@tanstack/react-table"
import type { Maquina } from "@/api/types" // Importe o tipo da máquina
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Props que nossa função de colunas vai receber
type ColumnsProps = {
  onEdit: (maquina: Maquina) => void;
}

// Transformamos 'columns' em uma função que recebe as props e retorna o array de colunas
export const columns = ({ onEdit }: ColumnsProps): ColumnDef<Maquina>[] => [
  { 
    accessorKey: "tag", 
    header: "TAG",
    cell: ({ row }) => <span className="font-mono">{row.original.tag}</span>
  },
  {
    accessorKey: "setorCidade",
    header: "Localização",
    cell: ({ row }) => {
        const { cidade, setor } = row.original.setorCidade;
        return <div>{cidade.nome} / {setor.nome}</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
        if (status === "EM_USO") variant = "default";
        if (status === "EM_MANUTENCAO") variant = "outline";
        if (status === "DESCARTADO") variant = "destructive";
        return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>
    }
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
      const maquina = row.original;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            
            <DropdownMenuItem onClick={() => onEdit(maquina)}>
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]