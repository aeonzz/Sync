"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import CommentForm from "../forms/comment-form";

interface ReplyBoxProps {
  avatarUrl: string | null;
  username: string | null;
  userId: string;
  postId: string;
  parentId: number;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({
  avatarUrl,
  username,
  userId,
  postId,
  parentId,
}) => {
  const [accordionValue, setAccourdionValue] = useState("");

  return (
    <div>
      <p
        onClick={() => {
          setAccourdionValue((prev) =>
            prev === "" ? "item-1" : "" || prev === "item-1" ? "" : "item-1",
          );
        }}
        className="ml-10 w-fit cursor-pointer !py-0 text-xs font-normal text-muted-foreground hover:underline"
      >
        Respond
      </p>
      <Accordion
        type="single"
        value={accordionValue}
        onValueChange={setAccourdionValue}
        collapsible
      >
        <AccordionItem value="item-1" className="border-transparent">
          <AccordionContent className="mt-2 px-10 pb-0">
            <CommentForm
              avatarUrl={avatarUrl}
              username={username}
              userId={userId}
              postId={postId}
              setAccourdionValue={setAccourdionValue}
              parentId={parentId}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ReplyBox;
