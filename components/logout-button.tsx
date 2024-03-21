"use client";

import { signOut } from "@/actions/auth";
import Link from "next/link";

const handleSignout = async () => {
  await signOut();
};

export default function LogoutButton() {
  return (
    <Link href="/" onClick={handleSignout} className="ml-5">
      Sign Out
    </Link>
  );
}
