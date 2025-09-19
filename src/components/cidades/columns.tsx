import type { ColumnDef } from "@tanstack/react-table"
import type { Cidade } from "@/api/types"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ColumnsProps = {
  onEdit: (cidade: Cidade) => void;
  onOpenDialog: (isOpen: boolean) => void;
}

export const columns = ({ onEdit, onOpenDialog }: ColumnsProps): ColumnDef<Cidade>[] => [
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "prefixo", header: "Prefixo" },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => { onEdit(row.original); onOpenDialog(true); }}>Editar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]