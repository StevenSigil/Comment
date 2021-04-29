import { signIn, signOut, useSession } from "next-auth/client";

import Link from "next/link";

export default function Navbar() {
  const [session, loading] = useSession();

  return (
    <nav>
      <div className="navBrand">
        <Link href="/">Commenter</Link>
      </div>

      <div className="navLinkContainer">
        <Link href="/">
          <a>Home</a>
        </Link>

        <Link href="/feed">
          <a>Feed</a>
        </Link>

        <Link href="/temp/create-post">
          <a>CreatePost</a>
        </Link>

        <Link href="/api/posts">
          <a>api/posts</a>
        </Link>

        <Link href="/api/profiles">
          <a>api/profiles</a>
        </Link>

        <Link href="/temp/dashboard">
          <a>Dashboard</a>
        </Link>

        {loading ? (
          <p>Loading auth...</p>
        ) : (
          <>
            {!session && <a onClick={signIn}>Sign in</a>}
            {session && (
              <a onClick={signOut}>
                {session.user.email.split("@")[0].toString()}
              </a>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
