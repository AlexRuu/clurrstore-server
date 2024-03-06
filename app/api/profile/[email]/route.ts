import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { email: string } }
) {
  try {
    if (!params.email) {
      return new NextResponse("Please provide an email", { status: 401 });
    }
    const profile = await prismadb.profile.findFirst({
      where: { email: params.email },
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
