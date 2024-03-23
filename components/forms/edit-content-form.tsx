"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { PostValidation } from "@/lib/validations/post";
import { cn } from "@/lib/utils";

interface EditContentFormProps {
  content: string;
  setIsEditing: (state: boolean) => void;
  ShortContentWithNoImage: boolean;
}
const EditContentForm: React.FC<EditContentFormProps> = ({
  content,
  setIsEditing,
  ShortContentWithNoImage,
}) => {
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      content: content,
    },
  });

  function onSubmit(data: z.infer<typeof PostValidation>) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full relative">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className={cn(
                    ShortContentWithNoImage && "!text-2xl",
                    content.length > 100 && "!h-[80px]",
                    content.length > 150 && "!h-[100px]",
                    content.length > 200 && "!h-[120px]",
                    content.length > 250 && "!h-[140px]",
                    "!min-h-[20px] resize-none bg-transparent p-0 text-base",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="absolute -top-14 right-14">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditContentForm;
