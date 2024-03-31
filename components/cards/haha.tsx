"use client"

import { getBanner } from "@/lib/actions/banner.actions";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import { Button } from "../ui/button";
import { sendEmail } from "@/lib/actions/email.actions";
import { toast } from "sonner";
import axios from "axios";

const Haha = () => {
  
  async function handleSendEmail() {
    const response = await axios.post("/api/send");

    if (response.status === 200) {
      toast("hahahaha")
    }
  }

  return (
    <Card className="flex h-1/2 items-center justify-center">
      <Button onClick={() => handleSendEmail()}>
        Send
      </Button>
    </Card>
  );
};

export default Haha;
