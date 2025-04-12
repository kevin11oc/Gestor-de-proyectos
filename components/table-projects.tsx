"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";

type Attachment = { name: string; url: string };

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  attachments?: string | Attachment[];
  designer_name: string;
};

interface Props {
  data: ProjectRow[];
  role: string | null;
  onDelete: (id: string) => void;
} 

export const ProjectTable = ({ data, role, onDelete }: Props) => {
  const columns: ColumnDef<ProjectRow>[] = [
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }: { row: Row<ProjectRow> }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "attachments",
      header: "Adjuntos",
      cell: ({ row }: { row: Row<ProjectRow> }) => {
        let parsed: Attachment[] = [];

        try {
          parsed =
            typeof row.original.attachments === "string"
              ? JSON.parse(row.original.attachments)
              : (row.original.attachments ?? []);
        } catch {
          parsed = [];
        }

        return (
          <div className="flex gap-1 max-w-[150px] overflow-x-auto">
            {parsed
              ?.slice(0, 3)
              .map((file, i) => (
                <img
                  key={i}
                  src={file.url}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ))}
          </div>
        );
      },
    },
    {
      accessorKey: "designer_name",
      header: "Diseñador asignado",
      cell: ({ row }: { row: Row<ProjectRow> }) => row.original.designer_name ?? "No asignado",
    },
    ...(role === "pm" ? [
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }: { row: Row<ProjectRow> }) => (
          <div className="flex gap-2">
            <Link href={`/${row.original.id}/edit-project`}>
              <Button size="icon" variant="ghost">
                <Pencil className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ] : []),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
