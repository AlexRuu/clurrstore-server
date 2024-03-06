import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;

    if (!user) {
      return new NextResponse("Please provide user data", { status: 401 });
    }

    const profile = await prismadb.profile.create({
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.user_metadata.first_name,
        lastName: user.user_metadata.last_name,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[PROFILE_POST] ERROR", error);
    return new NextResponse("Error creating user", { status: 501 });
  }
}
