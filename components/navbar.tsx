import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import LogoutButton from "@/components/logout-button";
import NavLinks from "@/components/nav-links";

const Navbar = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = await prismadb.profile.findFirst({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div className="border-b w-full">
      <div className="flex h-16 items-center px-4">
        Clurr's Studio Dashboard
        <NavLinks />
        {user && (
          <div className="flex items-center justify-center ml-auto space-x-4">
            Hey, {name?.firstName}!
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
