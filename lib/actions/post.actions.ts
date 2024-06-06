"use server";

import { redirect } from "next/navigation";
import getBase64 from "../base64";
import prisma from "../db";
import { AccessibilityType, PostType } from "@prisma/client";

// export async function getPosts(page: number) {
//   const take = 7;
//   const skip = (page - 1) * take;

//   try {
//     const response = await prisma.post.findMany({
//       include: {
//         author: {
//           include: {
//             StudentData: true,
//           },
//         },
//         imageUrls: true,
//       },
//       take,
//       skip,
//       orderBy: {
//         sequenceId: "desc",
//       },
//     });

//     const hasMore = response.length === take;

//     return { data: response, hasMore, error: null, status: 200 };
//   } catch (error: any) {
//     console.log(error);
//     return { data: null, error: error.message, status: 500 };
//   }
// }

export async function getPostById(postId: string, currentUserId: string) {
  try {
    const response = await prisma.post.findFirst({
      where: {
        postId: postId,
        deleted: false,
      },
      include: {
        _count: {
          select: {
            comment: true,
            postLike: true,
            imageUrls: true,
          },
        },
        author: {
          include: {
            studentData: true,
          },
        },
        imageUrls: true,
        postLike: {
          orderBy: {
            id: "desc",
          },
          // where: {
          //   userId: userId,
          // },
          include: {
            user: {
              include: {
                studentData: true,
              },
            },
          },
        },
        comment: {
          where: {
            parentId: null,
            deleted: false,
          },
          orderBy: {
            sequenceId: "desc",
          },
          include: {
            _count: {
              select: {
                commentLike: true,
                replies: true,
              },
            },
            commentLike: {
              select: {
                id: true,
                user: {
                  include: {
                    studentData: true,
                  },
                },
              },
            },
            user: {
              include: {
                studentData: true,
              },
            },
            replies: {
              where: {
                deleted: false,
              },
              orderBy: {
                sequenceId: "desc",
              },
              include: {
                _count: {
                  select: {
                    commentLike: true,
                  },
                },
                commentLike: {
                  select: {
                    id: true,
                    user: {
                      include: {
                        studentData: true,
                      },
                    },
                  },
                },
                user: {
                  include: {
                    studentData: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!response) {
      throw new Error();
    }

    const likeRecord = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: response!.postId,
        },
      },
    });

    const postWithLikedStatus = {
      ...response,
      isLikedByCurrentUser: likeRecord !== null,
    };

    return { data: postWithLikedStatus, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

interface CreatePostParams {
  userId: string;
  title?: string | undefined;
  content: string;
  images: (string | undefined)[];
  type: PostType;
  accessibility: AccessibilityType;
}

export async function createPost({
  userId,
  title,
  content,
  images,
  type,
  accessibility,
}: CreatePostParams) {
  try {
    const imageObjects = await Promise.all(
      images.map(async (image) => {
        if (image) {
          const blurDataUrl = await getBase64(image);
          return { url: image, blurDataUrl };
        }
      }),
    );

    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        type: type,
        accessibility,
        author: {
          connect: {
            id: userId,
          },
        },
        imageUrls: {
          //@ts-ignore
          create: imageObjects,
        },
      },
    });

    return { data: post, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

interface UpdatePostParams {
  postId: string;
  content: string;
  title?: string | undefined;
  images: (string | undefined)[] | undefined;
  deleteId: number[] | undefined;
}

export async function UpdatePost({
  content,
  title,
  postId,
  images,
  deleteId,
}: UpdatePostParams) {
  try {
    let imageObjects;
    if (images) {
      imageObjects = await Promise.all(
        images.map(async (image) => {
          if (image) {
            const blurDataUrl = await getBase64(image);
            return { url: image, blurDataUrl };
          }
        }),
      );
    }

    await prisma.post.update({
      where: { postId: postId },
      data: {
        title,
        content,
        imageUrls: {
          // @ts-ignore
          create: imageObjects,
        },
      },
    });

    await prisma.image.deleteMany({
      where: {
        id: {
          in: deleteId,
        },
      },
    });

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function deletePost(postId: string) {
  try {
    await prisma.post.update({
      where: { postId: postId },
      data: {
        deleted: true,
      },
    });
    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

interface likePostProps {
  userId: string;
  postId: string;
}

export async function likePost({ userId, postId }: likePostProps) {
  try {
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });
    }

    const newLikes = await prisma.postLike.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            studentId: true,
            username: true,
            avatarUrl: true,
            coverUrl: true,
            createdAt: true,
            studentData: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
                department: true,
              },
            },
          },
        },
      },
    });

    return { data: newLikes, error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { data: null, error: error.message, status: 500 };
  }
}

export async function checkIfUserLikedPost(userId: string, postId: string) {
  const likeRecord = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId: userId,
        postId: postId,
      },
    },
  });

  return likeRecord !== null;
}
