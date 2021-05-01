import { signIn, signOut, useSession, getSession } from "next-auth/client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [session, loading] = useSession();
  const [newUser, setNewUser] = useState(null);

  useEffect(async () => {
    const updated = await getSession().catch((e) => console.log(e));
    setNewUser(updated.user);
  }, []);

  return (
    <nav>
      <div className="navBrand">
        <Link href="/">Commenter</Link>
      </div>

      <div className="navLinkContainer">
        <Link href="/">
          <a>Home</a>
        </Link>

        {newUser ? (
          <Link href={`/feed/${newUser.pid}`}>
            <a>Feed</a>
          </Link>
        ) : null}

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
