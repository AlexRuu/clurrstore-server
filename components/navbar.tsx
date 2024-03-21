import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";

import LogoutButton from "@/components/logout-button";
import NavLinks from "@/components/nav-links";

const Navbar = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await prismadb.profile.findFirst({
    where: {
      id: user?.id,
    },
  });

  return (
    <div className="border-b w-full">
      <div className="flex h-16 items-center px-4">
        Clurr's Studio Dashboard
        <NavLinks />
        {user && (
          <div className="flex items-center justify-center ml-auto space-x-4">
            Hey, {profile?.firstName}!
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
