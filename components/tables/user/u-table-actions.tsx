"use client";

import { StudentData, User, UserRoleType } from "@prisma/client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Tags, Trash } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { editUserRole } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const roles = [UserRoleType.USER, UserRoleType.ADMIN, UserRoleType.SYSTEMADMIN];

interface UTableActionsProps {
  row: User;
}

const UTableActions: React.FC<UTableActionsProps> = ({ row }) => {
  const [actionDropdown, setActionDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleRoleUpdate(value: UserRoleType) {
    setIsLoading(true);

    const response = await editUserRole(row.id, value);

    if (response.status === 200) {
      setIsLoading(false);
      toast.success("Success!", {
        description: "The role has been updated successfully.",
      });
      setActionDropdown(false);
      queryClient.invalidateQueries({ queryKey: ["user-table-data"] });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }
  return (
    <DropdownMenu
      open={actionDropdown}
      onOpenChange={setActionDropdown}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[100px] p-1.5">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Tags className="mr-2 h-4 w-4" />
            Roles
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No roles found.</CommandEmpty>
                <CommandGroup>
                  {roles.map((role) => (
                    <CommandItem
                      key={role}
                      onSelect={() => handleRoleUpdate(role)}
                      disabled={isLoading}
                    >
                      {role}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UTableActions;
