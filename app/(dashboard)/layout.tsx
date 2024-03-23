import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  } else {
    const profile = await prismadb.profile.findFirst({
      where: { id: data.user.id, role: "ADMIN" },
    });

    if (!profile) {
      redirect("/login");
    }
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
