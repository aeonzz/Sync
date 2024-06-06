import { Session } from "next-auth";
import React from "react";
import ExplorePost from "./explore-post";
import { UserProps } from "@/types/user";

interface ExplorePageProps {
  session: Session;
  currentUserData: UserProps;
}

const ExplorePage: React.FC<ExplorePageProps> = ({
  session,
  currentUserData,
}) => {
  return <ExplorePost session={session} currentUserData={currentUserData} />;
};

export default ExplorePage;
