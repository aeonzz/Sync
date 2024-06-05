"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { StudentData } from "@prisma/client";
import STableActions from "./s-table-actions";

export const sColumns: ColumnDef<StudentData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentId",
    header: "Student Id",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "middleName",
    header: "Middle Name",
  },
  // {
  //   accessorKey: "status",
  //   header: "",
  //   cell: ({ row }) => {

  //     const status = row.original

  //     return (
  //       <div className='flex gap-3 items-center'>
  //         <Badge
  //         variant="outline"
  //         className={cn(
  //           status === 'banned' && 'text-red-500',
  //           'w-14 justify-center text-[10px]'
  //         )}
  //         >
  //           {status}
  //         </Badge>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">{row.getValue("lastName")}</div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "yearLevel",
    header: "Year Level",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {

      const newDate = new Date(row.original.createdAt)
      const newUpdate = format(newDate, 'PPpp')

      return (
        <div>{newUpdate}</div>
      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <STableActions row={row.original} />
  },
];
