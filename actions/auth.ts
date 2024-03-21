"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import prismadb from "@/lib/prismadb";

export async function login(email: string, password: string) {
  const supabase = createClient();

  const loginInfo = {
    email: email,
    password: password,
  };

  const { data, error } = await supabase.auth.signInWithPassword(loginInfo);

  if (error) {
    return false;
  } else {
    const profile = await prismadb.profile.findFirst({
      where: { id: data.user.id },
    });

    if (profile?.role !== "ADMIN") {
      return false;
    }

    revalidatePath("/", "layout");
    redirect("/");
  }
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
}
