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
  alignOffset?: number | undefined;
  onOpenEmojiPicker: (state: boolean) => void;
  openEmojiPicker: boolean;
  iconSize: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  handleEmojiClick,
  isLoading,
  side,
  sideOffset,
  align,
  className,
  onOpenEmojiPicker,
  openEmojiPicker,
  alignOffset,
  iconSize,
}) => {
  return (
    <Popover open={openEmojiPicker} onOpenChange={onOpenEmojiPicker}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            openEmojiPicker && "bg-yellow-500/15",
            "group transition-all hover:bg-yellow-500/15",
            className,
          )}
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            onOpenEmojiPicker(!openEmojiPicker);
          }}
          disabled={isLoading}
        >
          <SmilePlus
            className={cn(
              openEmojiPicker ? "text-yellow-500/70" : "text-foreground",
              "group-hover:text-yellow-500/70",
              iconSize,
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        alignOffset={alignOffset}
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
