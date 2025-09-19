import {flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import type {ColumnDef} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  pageTitle: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

export function DataTable<TData, TValue>({ columns, data, pageTitle, buttonLabel, onButtonClick }: DataTableProps<TData, TValue>) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <Button onClick={onButtonClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Nenhum resultado encontrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}