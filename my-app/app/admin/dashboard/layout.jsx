"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
console.log(pathname);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    // ❌ Not admin → redirect to login
    if (!isAdmin) {
      router.replace("/admin/login");
    }

    // ✅ Admin but tries to leave admin pages
    if (isAdmin && !pathname.startsWith("/admin")) {
      router.replace("/admin/dashboard");
    }

    setAuthorized(true);
  }, [pathname]);

  if (!authorized) return null;

  return <>{children}</>;
}