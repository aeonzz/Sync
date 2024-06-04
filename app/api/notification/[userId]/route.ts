import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface Context {
  params: {
    userId: string;
  };
}

// export async function GET(req: Request, params: Context) {
//   const { userId } = params.params;

//   try {
//     const notifications = await prisma.notification.findMany({
//       where: {
//         recipientId: userId,
//       },
//       include: {
//         from: true,
//       },
//       orderBy: {
//         id: "desc",
//       },
//     });

//     return NextResponse.json({ data: notifications }, { status: 200 });
//   } catch (error: any) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "could not get post" },
//       { status: 500 },
//     );
//   }
// }
export async function GET(req: Request, params: Context) {
  const { userId } = params.params;
  const url = new URL(req.url);
  const cursorParam = url.searchParams.get("cursor");
  const cursor = cursorParam ? parseInt(cursorParam, 10) : undefined;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        id: cursor ? { lt: cursor } : undefined,
      },
      include: {
        from: true,
      },
      orderBy: {
        id: "desc",
      },
      take: 10,
    });
    const lastNotification = notifications[notifications.length - 1];
    const nextCursor = lastNotification?.id || undefined;

    return NextResponse.json(
      {
        data: notifications,
        nextCursor,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "could not get post" },
      { status: 500 },
    );
  }
}
