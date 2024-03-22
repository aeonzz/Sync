export type PostType = {
  title?: string | undefined;
  content: string;
  imageUrls?: string | undefined;
};

export type PostProps = {
  sequenceId: number;
  postId: string;
  content: string;
  createdAt: Date;
  imageUrls: {
    id: number
    url: string | null
    postId: string
    // userId: number
    // createdAt: Date
  }[] | null;
  author: {
    id: string;
    studentId: number;
    avatarUrl: string | null;
    coverUrl: string | null;
    username: string | null;
    createdAt: Date;
    StudentData: {
      firstName: string;
      middleName: string;
      lastName: string;
      department: string;
    }
  };
};