// Main page of site. User can see whatever posts they want but cannot comment/like/etc... unless signed in.

import { connectToDatabase } from "../util/mongodb";

import { useEffect, useState } from "react";

import { getSession, useSession } from "next-auth/client";
import axios from "axios";

import Head from "next/head";
import Posts from "../models/postModel";
import UserProfiles from "../models/profileModel";
import Comments from "../models/commentModel";
import Home from "../components/Home";
import LoadingIcon from "../components/LoadingIcon";

import { useAllPosts } from "../util/swrHooks";

export default function HomeIndex({ initialPosts }) {
  const [session, loading] = useSession();
  const [needProfile, setNeedProfile] = useState(false);
  const [profileId, setProfileId] = useState(false);

  const { posts, isLoading, isError } = useAllPosts();

  const [updatedPosts, setUpdatedPosts] = useState(initialPosts);

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts, setUpdatedPosts]);

  useEffect(() => {
    if (session && !session.user.pid) {
      setNeedProfile(true);
    }
    if (session) setProfileId(session.user.pid);
  }, [session]);

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {needProfile && session ? (
        <DisplayNameForm
          session={session}
          setShowInput={setNeedProfile}
          setProfileId={setProfileId}
        />
      ) : null}

      {isError ? <div>Error loading via SWR</div> : null}
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <Home posts={updatedPosts} profileId={profileId} />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  // Use this to refresh results on page load and refresh!
  //  Use getStaticProps() to only get results on APPLICATION BUILD (once on deploy).

  // TODO: paginate this response!!!

  const selectOptions = "message date_time replys is_reply likes";

  const postList = await Posts.find()
    .populate("posting_user", ["display_name", "photo_url"], UserProfiles)
    .populate("likes", ["display_name", "photo_url"], UserProfiles)
    .populate({
      path: "comments",
      select: selectOptions,
      match: { is_reply: false },
      populate: [
        {
          path: "replys",
          select: selectOptions,
          model: Comments,
          populate: {
            path: "commenting_user",
            select: "display_name photo_url",
            model: UserProfiles,
          },
        },
        {
          path: "commenting_user",
          select: "display_name photo_url",
          model: UserProfiles,
        },
      ],
      model: Comments,
    })
    .exec();

  // await connectToDatabase();
  // const postList = await Posts.find()
  //   .populate("posting_user", ["display_name", "photo_url"], UserProfiles)
  //   .populate("likes", ["display_name", "photo_url"], UserProfiles)
  //   .populate({
  //     path: "comments",
  //     select: selectOptions,
  //     populate: [
  //       {
  //         path: "replys",
  //         select: selectOptions,
  //         model: Comments,
  //       },
  //       {
  //         path: "commenting_user",
  //         select: "display_name photo_url",
  //         model: UserProfiles,
  //       },
  //     ],
  //     model: Comments,
  //   })
  //   .exec();

  return {
    props: {
      initialPosts: JSON.parse(JSON.stringify(postList)),
    },
  };
}

function DisplayNameForm({ session, setShowInput, setProfileId }) {
  // Basic input allowing a user to set a displayName which creates a userProfile
  // which is needed for most other requests.

  // TODO: Make this a modal or something that is not able to be bypassed.

  const [displayNameInput, setDisplayNameInput] = useState("");

  async function submitNewProfile(e) {
    e.preventDefault();

    const data = {
      base_user_id: session.user.id,
      display_name: displayNameInput,
    };

    try {
      const res = await axios.post(`${process.env.SERVER}/api/profiles`, data);
      const resData = await res.data;
      console.log(resData);

      // Refresh session state
      const session = await getSession();
      setProfileId(session.user.pid);

      // Clear and close form
      setDisplayNameInput("");
      setShowInput(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={{ margin: "2rem 0" }}>
      <p style={{ fontWeight: "700" }}>
        Please update your display name to continue with most features
      </p>
      <form onSubmit={submitNewProfile}>
        <input
          type="text"
          placeholder="please enter a display name..."
          value={displayNameInput}
          onChange={(e) => setDisplayNameInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
