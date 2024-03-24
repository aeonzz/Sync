"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import EmojiPicker from "emoji-picker-react";

const Haha = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Card>
        <CardContent>
          <Button onClick={() => setIsEditing(true)}>open</Button>
          <Button onClick={() => setIsEditing(false)}>close</Button>

          <AnimatePresence>
            {isEditing ? (
              <motion.div
                key="gg"
                initial={{ height: 0 }}
                animate={{ height: 225 }}
                exit={{ height: 0 }}
                className="w-32 overflow-hidden border border-white"
              >
                <Gh />
              </motion.div>
            ) : (
              <Gh />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      {/* <div id="tangina" className="w-32 h-32 rounded-lg bg-blue-400"></div> */}
    </div>
  );
};

export default Haha;

export const Gh = () => {
  return <div>aahahahhahaa</div>;
};
