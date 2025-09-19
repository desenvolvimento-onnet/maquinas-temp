import type { ColumnDef } from "@tanstack/react-table"
import type { Responsavel } from "@/api/types"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

type ColumnsProps = {
  onEdit: (responsavel: Responsavel) => void;
}

export const responsavelColumns = ({ onEdit }: ColumnsProps): ColumnDef<Responsavel>[] => [
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "email", header: "Email" },
  { 
    accessorKey: "ativo", 
    header: "Status",
    cell: ({ row }) => row.original.ativo 
      ? <Badge>Ativo</Badge> 
      : <Badge variant="destructive">Inativo</Badge>
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>Editar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]