import Navbar from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
