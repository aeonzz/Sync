import { UserRoleType, YearLevel } from "@prisma/client";

export type UserProps = {
  id: string;
  role: UserRoleType;
  studentId: number;
  password: string;
  avatarUrl: string | null;
  coverUrl: string;
  username: string | null;
  bio: string | null;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    following: number;
  };
  studentData: {
    firstName: string;
    middleName: string;
    lastName: string;
    department: string;
    yearLevel: YearLevel;
    section: string | null;
    createdAt: Date;
  };
  following: {
    followerId: string;
  }[];
};

export type UsersCardProps = {
  user: UserProps;
  isFollowedByCurrentUser: boolean;
};
