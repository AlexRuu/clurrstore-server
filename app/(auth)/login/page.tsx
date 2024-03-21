import PageHeader from "@/components/header";
import LoginForm from "./components/login-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const LoginPage = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await prismadb.profile.findFirst({
    where: { id: user?.id, role: "ADMIN" },
  });

  if (profile) {
    redirect("/");
  }

  return (
    <main className="min-h-[500px] mt-10 pb-[30px] small:mt-0 xsmall:mt-0">
      <section className="xl:!p-[0px_85px] p-[0px_55px] med-small:p-0">
        <PageHeader headerTitle="Login" />
        <div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
