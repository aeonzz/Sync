// export type UserType = {
//   username?: string | undefined;
//   password?: string | undefined;
//   avatarUrl?: string | undefined;
//   onboarded?: boolean | undefined;
// };

export type UserProps = {
  id: string;
  studentId: number;
  password: string;
  avatarUrl: string | null;
  coverUrl: string;
  username: string | null;
  bio: string | null;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  StudentData: {
    firstName: string;
    middleName: string;
    lastName: string;
    department: string;
  };
  Urls: {
    id: number
    url: string;
  } [] | undefined
};
