"use state";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { emojis } from "@/constants";
import { cn } from "@/lib/utils";
import { SmilePlus } from "lucide-react";

interface EmojiPickerProps {
  handleEmojiClick: (emoji: string) => void;
  isLoading: boolean;
  className?: string | undefined;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  align?: "start" | "center" | "end" | undefined;
  sideOffset?: number | undefined;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  handleEmojiClick,
  isLoading,
  side,
  sideOffset,
  align,
  className,
}) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  return (
    <Popover open={openEmojiPicker} onOpenChange={setOpenEmojiPicker}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            openEmojiPicker && "bg-yellow-500/15",
            "group transition-all hover:bg-yellow-500/15",
          )}
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            setOpenEmojiPicker(!openEmojiPicker);
          }}
          disabled={isLoading}
        >
          <SmilePlus
            className={cn(
              openEmojiPicker && "text-yellow-500/70",
              "h-4 w-4 group-hover:text-yellow-500/70",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-fit p-1"
      >
        {emojis.map((emoji, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            onClick={() => {
              handleEmojiClick(emoji.emoji);
            }}
            className="text-lg"
          >
            {emoji.emoji}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
