import { auth, clerkClient } from "@clerk/nextjs/server";

export async function requireUser() {
  const a = await auth();
  if (!a.userId) throw new Error("UNAUTHORIZED");
  return a;
}

export async function requireAdmin() {
  const a = await auth();
  if (!a.userId) throw new Error("UNAUTHORIZED");

  const user = await (await clerkClient()).users.getUser(a.userId);
  const role = (user.publicMetadata?.role ?? user.privateMetadata?.role) as
    | string
    | undefined;

  const email = user.emailAddresses[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;

  // Allow if role is admin OR if email matches the ADMIN_EMAIL env var
  if (role !== "admin" && (!adminEmail || email !== adminEmail)) {
    throw new Error("FORBIDDEN");
  }
  return { auth: a, user, role };
}
