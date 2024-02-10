import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const validateEmail = (email: string) => {
  const regExTest = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm;
  if (regExTest.test(email)) {
    return true;
  } else {
    return false;
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
      return new NextResponse("Please provide an email", { status: 401 });
    }

    if (!validateEmail(body)) {
      return new NextResponse("Please provide a valid email", { status: 401 });
    }

    const subscriber = await prismadb.newsletter.create({
      data: { email: body },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.log("[NEWSLETTER_POST] error", error);
    return new NextResponse("Newsletter post internal error", { status: 500 });
  }
}
