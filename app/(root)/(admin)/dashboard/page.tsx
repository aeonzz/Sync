import UserTableView from "@/components/tables/user/user-table-view";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { UserRoleType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  const currentUser = await getUserById(session!.user.id);
  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (!currentUser.data.onboarded) {
    redirect("/onboarding");
  }

  if (currentUser.data.role !== UserRoleType.SYSTEMADMIN) {
    notFound();
  }

  return (
    <section className="h-full w-full bg-card p-6">
      <h3 className="text-2xl font-semibold tracking-tight">Dashboard</h3>
      <UserTableView />
    </section>
  );
};

export default page;
