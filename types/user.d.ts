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
  studentData: {
    firstName: string;
    middleName: string;
    lastName: string;
    department: string;
  }
};
