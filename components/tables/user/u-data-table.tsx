"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import React, { useState } from "react";
import { ChevronDown, Plus, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DepartmentType, UserRoleType, YearLevel } from "@prisma/client";
import StudentForm from "@/components/forms/student-form";
import { UDataTablePagination } from "./u-data-table-pagination";

interface UDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UDataTable<TData, TValue>({
  columns,
  data,
}: UDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);

  const updateOpenState = (newOpenState: boolean) => {
    setOpen(newOpenState);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const roleFilter =
    (table.getColumn("role")?.getFilterValue() as string) ?? "";
  const departmentFilter =
    (table.getColumn("department")?.getFilterValue() as string) ?? "";
  const yearFilter =
    (table.getColumn("yearLevel")?.getFilterValue() as string) ?? "";
  const sectionFilter =
    (table.getColumn("section")?.getFilterValue() as string) ?? "";

  const handleReset = () => {
    table.getColumn("role")?.setFilterValue("");
    table.getColumn("department")?.setFilterValue("");
    table.getColumn("yearLevel")?.setFilterValue("");
    table.getColumn("section")?.setFilterValue("");
  };

  return (
    <div className="mt-5">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex w-full items-center space-x-4">
            <Input
              placeholder="Filter email..."
              value={
                (table.getColumn("lastName")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("lastName")?.setFilterValue(event.target.value)
              }
              className="max-w-xs bg-background text-xs"
            />
          </div>
        </div>
      </Card>
      <Card className="bg-background p-5">
        <div className="mb-5 flex items-center justify-between space-x-2">
          <div>
            <h3 className="text-md font-semibold tracking-tight">Users</h3>
            <p className="text-xs text-muted-foreground">Users lists</p>
          </div>
          <div className="flex items-center space-x-2">
            {roleFilter === "" &&
            departmentFilter === "" &&
            yearFilter === "" &&
            sectionFilter === "" ? null : (
              <Button
                onClick={() => handleReset()}
                variant="ghost"
                className="flex items-center"
              >
                reset
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#161312] text-xs">
                  <UserCog className="mr-1 h-4 w-4" />
                  Roles
                  {roleFilter === "" ? null : (
                    <>
                      <Separator className="ml-2 mr-2" orientation="vertical" />
                      {roleFilter === "" ? null : (
                        <Badge variant="secondary">{roleFilter}</Badge>
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>User roles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={
                    (table.getColumn("role")?.getFilterValue() as string) ?? ""
                  }
                  onValueChange={(newValue) =>
                    table.getColumn("role")?.setFilterValue(newValue)
                  }
                >
                  <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={UserRoleType.USER}>
                    User
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={UserRoleType.ADMIN}>
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={UserRoleType.SYSTEMADMIN}>
                    SystemAdmin
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <UDataTablePagination table={table} />
      </Card>
    </div>
  );
}
