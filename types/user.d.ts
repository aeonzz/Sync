export type UserType = {
  username?: string | undefined;
  password?: string | undefined;
  avatarUrl?: string | undefined;
  onboarded?: boolean | undefined;
};

export type CurrentUser = {
  id: string;
  studentId: number;
  username: string;
  password: string;
  avatarUrl: string | null;
  displayName: string | null;
  bio: string | null;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  StudentData: {
    name: string;
  };
};
