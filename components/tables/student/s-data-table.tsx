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
import { SDataTablePagination } from "./s-data-table.pagination";
import { DepartmentType, YearLevel } from "@prisma/client";
import StudentForm from "@/components/forms/student-form";

interface SDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function SDataTable<TData, TValue>({
  columns,
  data,
}: SDataTableProps<TData, TValue>) {
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
              placeholder="Filter student last name..."
              value={
                (table.getColumn("lastName")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("lastName")?.setFilterValue(event.target.value)
              }
              className="max-w-xs bg-background text-xs"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="relative h-8 rounded-sm px-16">
                <Plus className="absolute left-[28%] h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">
                  Add user
                </DialogTitle>
                <DialogDescription>
                  Please provide the following information to add a new user to
                  the system.
                </DialogDescription>
              </DialogHeader>
              <StudentForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </Card>
      <Card className="bg-background p-5">
        <div className="mb-5 flex items-center justify-between space-x-2">
          <div>
            <h3 className="text-md font-semibold tracking-tight">Stundents</h3>
            <p className="text-xs text-muted-foreground">Studens lists</p>
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
                  Year
                  {yearFilter === "" ? null : (
                    <>
                      <Separator className="ml-2 mr-2" orientation="vertical" />
                      {yearFilter === "" ? null : (
                        <Badge variant="secondary">{yearFilter}</Badge>
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Year levels</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={
                    (table
                      .getColumn("yearLevel")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onValueChange={(newValue) =>
                    table.getColumn("yearLevel")?.setFilterValue(newValue)
                  }
                >
                  <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={YearLevel.first}>
                    1st year
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={YearLevel.second}>
                    2nd year
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={YearLevel.third}>
                    3rd year
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={YearLevel.fourth}>
                    4th year
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#161312] text-xs">
                  <UserCog className="mr-1 h-4 w-4" />
                  Section
                  {sectionFilter === "" ? null : (
                    <>
                      <Separator className="ml-2 mr-2" orientation="vertical" />
                      {sectionFilter === "" ? null : (
                        <Badge variant="secondary">{sectionFilter}</Badge>
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sections</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={
                    (table.getColumn("section")?.getFilterValue() as string) ??
                    ""
                  }
                  onValueChange={(newValue) =>
                    table.getColumn("section")?.setFilterValue(newValue)
                  }
                >
                  <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="A">A</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="B">B</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="C">C</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="D">D</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#161312] text-xs">
                  <UserCog className="mr-1 h-4 w-4" />
                  Department
                  {departmentFilter === "" ? null : (
                    <>
                      <Separator className="ml-2 mr-2" orientation="vertical" />
                      {departmentFilter === "" ? null : (
                        <Badge variant="secondary">{departmentFilter}</Badge>
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Departments</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={
                    (table
                      .getColumn("department")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onValueChange={(newValue) =>
                    table.getColumn("department")?.setFilterValue(newValue)
                  }
                >
                  <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={DepartmentType.BSIT}>
                    BSIT
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={DepartmentType.BSNAME}>
                    BSNAME
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={DepartmentType.BSESM}>
                    BSESM
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={DepartmentType.BSTCM}>
                    BSTCM
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={DepartmentType.BSMET}>
                    BSMET
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
        <SDataTablePagination table={table} />
      </Card>
    </div>
  );
}
