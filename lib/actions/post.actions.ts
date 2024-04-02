"use server";

import getBase64 from "../base64";
import prisma from "../db";

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

export async function getPostById(postId: string) {
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
            imageUrls: true,
          },
        },
        author: {
          include: {
            StudentData: true,
          },
        },
        imageUrls: true,
        comment: {
          include: {
            user: {
              include: {
                StudentData: true,
              },
            },
          },
        },
      },
    });

    return { data: response, error: null, status: 200 };
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
}

export async function createPost({
  userId,
  title,
  content,
  images,
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

    await prisma.post.create({
      data: {
        title: title,
        content: content,
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

    return { error: null, status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
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
