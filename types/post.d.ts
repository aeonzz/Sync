export type PostType = {
  sequenceId?: number;
  postId?: string;
  title?: string | undefined;
  content: string;
  image?: string | undefined;
  author: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
  };
};
