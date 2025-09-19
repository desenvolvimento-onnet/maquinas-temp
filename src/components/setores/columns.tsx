import type { ColumnDef } from "@tanstack/react-table"
import type{ Setor } from "@/api/types"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ColumnsProps = {
  onEdit: (setor: Setor) => void;
}

export const columns = ({ onEdit }: ColumnsProps): ColumnDef<Setor>[] => [
  { 
    accessorKey: "nome", 
    header: "Nome do Setor" 
  },
  { 
    accessorKey: "prefixo", 
    header: "Prefixo",
    cell: ({ row }) => <span className="font-mono uppercase">{row.original.prefixo}</span>
  },
  { 
    accessorKey: "updatedAt", 
    header: "Última Atualização", 
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }) 
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Editar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]