"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { DepartmentType, StudentData, YearLevel } from "@prisma/client";
import { createStudent } from "@/lib/actions/student.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const FormSchema = z.object({
  studentId: z
    .string()
    .min(1, {
      message: "Student Id is required",
    })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Student Id must be a number" }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  middleName: z.string().min(2, {
    message: "Middle name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  section: z.string().min(1, {
    message: "Section required",
  }),
  yearLevel: z.string({
    required_error: "Please select from year level options",
  }),
  department: z.string({
    required_error: "Please select from department options",
  }),
});

interface StudentFormProps {
  setOpen: (state: boolean) => void;
  formData?: StudentData | undefined;
}

const StudentForm: React.FC<StudentFormProps> = ({ setOpen, formData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      studentId: formData ? formData.studentId : 0,
      firstName: formData ? formData.firstName : "",
      middleName: formData ? formData.middleName : "",
      lastName: formData ? formData.lastName : "",
      section: formData ? formData.section : "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setIsLoading(true);

    const { yearLevel, department, ...restData } = data;

    const studentData = {
      ...restData,
      yearLevel: yearLevel as YearLevel,
      department: department as DepartmentType,
    };

    const response = await createStudent(studentData);

    if (response.status === 200) {
      setIsLoading(false);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["student-data"] });
    } else if (response.exist) {
      setIsLoading(false);
      toast.warning("Uh oh! Something went wrong.", {
        description: "ID already exists",
      });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Student Id</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="Enter Student Id"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Christian"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Haha" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Caneos" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <FormControl>
                <Input placeholder="A" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearLevel"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Year Level</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    className="text-muted-foreground"
                    disabled={isLoading}
                  >
                    <SelectValue placeholder="Year Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value={YearLevel.first}
                    onClick={(e) => e.preventDefault()}
                  >
                    1st
                  </SelectItem>
                  <SelectItem
                    value={YearLevel.second}
                    onClick={(e) => e.preventDefault()}
                  >
                    2nd
                  </SelectItem>
                  <SelectItem
                    value={YearLevel.third}
                    onClick={(e) => e.preventDefault()}
                  >
                    3rd
                  </SelectItem>
                  <SelectItem
                    value={YearLevel.fourth}
                    onClick={(e) => e.preventDefault()}
                  >
                    4th
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger
                    className="text-muted-foreground"
                    disabled={isLoading}
                  >
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    value={DepartmentType.BSIT}
                    onClick={(e) => e.preventDefault()}
                  >
                    BSIT
                  </SelectItem>
                  <SelectItem
                    value={DepartmentType.BSESM}
                    onClick={(e) => e.preventDefault()}
                  >
                    BSESM
                  </SelectItem>
                  <SelectItem
                    value={DepartmentType.BSMET}
                    onClick={(e) => e.preventDefault()}
                  >
                    BSMET
                  </SelectItem>
                  <SelectItem
                    value={DepartmentType.BSNAME}
                    onClick={(e) => e.preventDefault()}
                  >
                    BSNAME
                  </SelectItem>
                  <SelectItem
                    value={DepartmentType.BSTCM}
                    onClick={(e) => e.preventDefault()}
                  >
                    BSTCM
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default StudentForm;
