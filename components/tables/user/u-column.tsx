"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { StudentData, User } from "@prisma/client";
import UTableActions from "./u-table-actions";

export const UColumns: ColumnDef<User>[] = [
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
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "studentId",
    header: "Student Id",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const newDate = new Date(row.original.createdAt);
      const newUpdate = format(newDate, "PPpp");

      return <div>{newUpdate}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <UTableActions row={row.original} />,
  },
];
