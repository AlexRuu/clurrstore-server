import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse("Please provide an id", { status: 401 });
    }
    const profile = await prismadb.profile.findFirst({
      where: { id: params.id },
      include: {
        order: true,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    console.log("[PROFILE_GET] error", error);
    return new NextResponse("Error retrieving profile", { status: 500 });
  }
}
