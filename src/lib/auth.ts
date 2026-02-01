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

  // flexible support for ADMIN_EMAIL (csv) or explicit ADMIN_EMAIL_1/2
  const adminEmails = [
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2
  ]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map(e => e.trim());

  // Allow if role is admin OR if email is in the admin list
  if (role !== "admin" && (!email || !adminEmails.includes(email))) {
    throw new Error("FORBIDDEN");
  }
  return { auth: a, user, role };
}
