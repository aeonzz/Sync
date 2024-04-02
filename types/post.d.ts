// export type PostType = {
//   title?: string | undefined;
//   content: string;
//   imageUrls?: string | undefined;
// };

export type PostProps = {
  sequenceId: number;
  postId: string;
  title: string | null;
  content: string;
  createdAt: Date;
  imageUrls: {
    id: number;
    url: string | null;
    postId: string;
    blurDataUrl: string;
  }[];
  author: {
    id: string;
    studentId: number;
    avatarUrl: string | null;
    coverUrl: string;
    username: string | null;
    createdAt: Date;
    StudentData: {
      firstName: string;
      middleName: string;
      lastName: string;
      department: string;
    };
  };
  _count: {
    comment: number;
    imageUrls: number;
  };
  comment: {
    commentId: number | null;
    text: string;
    createdAt: Date;
    user: {
      id: string;
      studentId: number;
      username: string | null;
      avatarUrl: string | null;
      coverUrl: string;
      createdAt: Date;
      StudentData: {
        firstName: string;
        middleName: string;
        lastName: string;
        department: string;
      };
    };
  }[];
};

export type CommentProps = {
  commentId: number | null;
  text: string;
  createdAt: Date;
  user: {
    id: string;
    studentId: number;
    username: string | null;
    avatarUrl: string | null;
    coverUrl: string;
    createdAt: Date;
    StudentData: {
      firstName: string;
      middleName: string;
      lastName: string;
      department: string;
    };
  };
};
