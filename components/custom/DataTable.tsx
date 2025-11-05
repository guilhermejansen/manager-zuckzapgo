/**
 * DataTable Component
 *
 * Tabela de dados com:
 * - Ordenação
 * - Paginação
 * - Loading state
 * - Click em linhas
 * - Suporte a TanStack Table
 */

"use client"

import { useState } from "react"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/**
 * DataTable Component
 *
 * Tabela de dados com:
 * - Ordenação
 * - Paginação
 * - Loading state
 * - Click em linhas
 * - Suporte a TanStack Table
 */

/**
 * DataTable Component
 *
 * Tabela de dados com:
 * - Ordenação
 * - Paginação
 * - Loading state
 * - Click em linhas
 * - Suporte a TanStack Table
 */

/**
 * DataTable Component
 *
 * Tabela de dados com:
 * - Ordenação
 * - Paginação
 * - Loading state
 * - Click em linhas
 * - Suporte a TanStack Table
 */

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  onRowClick?: (row: TData) => void
  noBorder?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onRowClick,
  noBorder = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  const tableMarkup = (
    <Table className="min-w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              onClick={() => onRowClick?.(row.original)}
              className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Nenhum resultado encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  if (loading) {
    return (
      <div className={noBorder ? "" : "rounded-md border bg-card"}>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                {columns.map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((row) => (
                <TableRow key={row}>
                  {columns.map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className={noBorder ? "" : "rounded-md border bg-card"}>
      <div className="overflow-x-auto">{tableMarkup}</div>
    </div>
  )
}
