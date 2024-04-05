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
    studentData: {
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
    id: number;
    text: string;
    createdAt: Date;
    _count: {
      commentLike: number;
      replies: number;
    };
    replies: {
      id: number;
      text: string;
      createdAt: Date;
      _count: {
        commentLike: number;
      };
      commentLike: {
        id: number;
        user: {
          id: string;
          studentId: number;
          username: string | null;
          avatarUrl: string | null;
          coverUrl: string;
          createdAt: Date;
          studentData: {
            firstName: string;
            middleName: string;
            lastName: string;
            department: string;
          };
        };
      }[];
      user: {
        id: string;
        studentId: number;
        username: string | null;
        avatarUrl: string | null;
        coverUrl: string;
        createdAt: Date;
        studentData: {
          firstName: string;
          middleName: string;
          lastName: string;
          department: string;
        };
      };
    }[];
    commentLike: {
      id: number;
      user: {
        id: string;
        studentId: number;
        username: string | null;
        avatarUrl: string | null;
        coverUrl: string;
        createdAt: Date;
        studentData: {
          firstName: string;
          middleName: string;
          lastName: string;
          department: string;
        };
      };
    }[];
    user: {
      id: string;
      studentId: number;
      username: string | null;
      avatarUrl: string | null;
      coverUrl: string;
      createdAt: Date;
      studentData: {
        firstName: string;
        middleName: string;
        lastName: string;
        department: string;
      };
    };
  }[];
};

export type CommentProps = {
  id: number;
  text: string;
  createdAt: Date;
  _count: {
    commentLike: number;
    replies: number;
  };
  replies: {
    id: number;
    text: string;
    createdAt: Date;
    _count: {
      commentLike: number;
    };
    commentLike: {
      id: number;
      user: {
        id: string;
        studentId: number;
        username: string | null;
        avatarUrl: string | null;
        coverUrl: string;
        createdAt: Date;
        studentData: {
          firstName: string;
          middleName: string;
          lastName: string;
          department: string;
        };
      };
    }[];
    user: {
      id: string;
      studentId: number;
      username: string | null;
      avatarUrl: string | null;
      coverUrl: string;
      createdAt: Date;
      studentData: {
        firstName: string;
        middleName: string;
        lastName: string;
        department: string;
      };
    };
  }[];
  commentLike: {
    id: number;
    user: {
      id: string;
      studentId: number;
      username: string | null;
      avatarUrl: string | null;
      coverUrl: string;
      createdAt: Date;
      studentData: {
        firstName: string;
        middleName: string;
        lastName: string;
        department: string;
      };
    };
  }[];
  user: {
    id: string;
    studentId: number;
    username: string | null;
    avatarUrl: string | null;
    coverUrl: string;
    createdAt: Date;
    studentData: {
      firstName: string;
      middleName: string;
      lastName: string;
      department: string;
    };
  };
};

export type ReplyProps = {
  id: number;
  text: string;
  createdAt: Date;
  _count: {
    commentLike: number;
  };
  commentLike: {
    id: number;
    user: {
      id: string;
      studentId: number;
      username: string | null;
      avatarUrl: string | null;
      coverUrl: string;
      createdAt: Date;
      studentData: {
        firstName: string;
        middleName: string;
        lastName: string;
        department: string;
      };
    };
  }[];
  user: {
    id: string;
    studentId: number;
    username: string | null;
    avatarUrl: string | null;
    coverUrl: string;
    createdAt: Date;
    studentData: {
      firstName: string;
      middleName: string;
      lastName: string;
      department: string;
    };
  };
};
