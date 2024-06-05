import { Session } from "next-auth";
import React from "react";
import ExplorePost from "./explore-post";

interface ExplorePageProps {
  session: Session;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ session }) => {
  return <ExplorePost session={session} />;
};

export default ExplorePage;
