import OnboardingForm from "@/components/forms/onboarding-form";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Onboarding = async () => {
  const session = await getServerSession(authOptions);
  const currentUser = await getUserById(session!.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (currentUser.data.onboarded) {
    redirect("/home");
  }

  return (
    <section className="flex h-screen w-full items-center justify-center">
      <div className="h-auto w-[600px] space-y-5">
        <OnboardingForm />
      </div>
    </section>
  );
};

export default Onboarding;
