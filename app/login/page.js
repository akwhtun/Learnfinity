"use client";
import { signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const callbackUrl = searchParams?.get("callbackUrl") || "/";

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Google OAuth</h1>
            <h1>Google OAuth</h1>
            <h1>Google OAuth</h1>
            <h1>Google OAuth</h1>

            {session?.user ? (
                <div>
                    <img
                        src={session.user?.image}
                        alt="User profile"
                        className="w-8 h-8 rounded-full border-2 border-white"
                    />
                    <span className="hidden md:inline-block font-medium">
                        {session.user?.name} | {session.user?.email}
                    </span>
                    <button
                        onClick={() =>
                            signOut() 
                        }
                        className="block w-full text-left px-4 py-2 hover:bg-violet-100"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => signIn("google")}
                    className="lg:mt-1 mt-48 flex items-center px-4 py-2 border rounded-md shadow-sm text-lg font-medium bg-violet-600 text-white"
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        className="w-5 h-5 mr-2"
                    />
                    Sign in with Google
                </button>
            )}
        </div>
    );
}