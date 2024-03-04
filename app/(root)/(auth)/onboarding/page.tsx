import OnboardingForm from "@/components/forms/onboarding-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";

const Onboarding = async () => {
  const currentUser = await getUser();

  if (currentUser?.onboarded) {
    redirect("/home");
  }

  return (
    <section className="flex h-screen w-full items-center justify-center">
      <Card className="h-auto w-[550px] p-2">
        <CardHeader>
          <CardTitle>Onboarding.</CardTitle>
          <CardDescription>
            Complete your profile now, to use Sync.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default Onboarding;
