"use client";

import { Card, CardContent } from "../ui/card";

interface ProfileHoverProps {
  className?: string | null;
}

const ProfileHover: React.FC<ProfileHoverProps> = ({ className }) => {
  return (
    <Card>
      <CardContent></CardContent>
    </Card>
  );
};

export default ProfileHover;
