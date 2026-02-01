import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

async function setAdminRole(email: string) {
    if (!email) {
        console.error("Please provide an email address.");
        process.exit(1);
    }

    try {
        console.log(`Searching for user with email: ${email}...`);
        const userList = await clerkClient.users.getUserList({
            emailAddress: [email],
        });

        if (userList.data.length === 0) {
            console.error("User not found in Clerk. Please sign up first.");
            process.exit(1);
        }

        const user = userList.data[0];
        console.log(`Found user: ${user.firstName} ${user.lastName} (${user.id})`);

        await clerkClient.users.updateUser(user.id, {
            publicMetadata: {
                role: "admin",
            },
        });

        console.log(`✅ Successfully promoted ${email} to ADMIN.`);
    } catch (error) {
        console.error("Error updating user:", error);
        process.exit(1);
    }
}

// Get email from command line args
const email = process.argv[2];
setAdminRole(email);
