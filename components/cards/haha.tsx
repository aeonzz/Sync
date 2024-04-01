"use client";

import { getBanner } from "@/lib/actions/banner.actions";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import { Button } from "../ui/button";

const Haha = () => {
  async function handleSendEmail() {

  }

  return (
    <Card className="flex h-1/2 items-center justify-center">
      <Button onClick={() => handleSendEmail()}>Send</Button>
    </Card>
  );
};

export default Haha;
