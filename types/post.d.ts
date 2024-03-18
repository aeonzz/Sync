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
    url: string
    postId: number
    userId: number
    createdAt: Date
  }[] | null;
  author: {
    id: string;
    studentId: string;
    avatarUrl: string;
    coverUrl: string;
    username: string;
    createdAt: Date;
    StudentData: {
      firstName: string;
      middleName: string;
      lastName: string;
      department: string;
    }
  };
};