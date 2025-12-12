import { redirect } from "next/navigation";
import { getUserFromCookies } from "./auth";
import type { UserRole } from "./types";

export const requireUser = async () => {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/auth/login");
  }
  if (user.isSuspended) {
    redirect("/auth/login?status=suspended");
  }
  return user;
};

export const requireRole = async (allowedRoles: UserRole[]) => {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect("/auth/login");
  }
  return user;
};
