import Head from "next/head";

import { connectToDatabase } from "../util/mongodb";
import Post from "../models/postModel";
// import UserProfiles from "../models/profileModel";

export default function Home({ arr }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>TITLE HERE</h1>

        <div>
          {arr.map((item) => (
            <div key={item._id}>
              <p>{item.meta_title || item.display_name}</p>
              <p>{item.meta_description || item.base_user_id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Use this to refresh results on page load and refresh!
  //  Use getStaticProps() to only get results on APPLICATION BUILD (once on deploy).

  await connectToDatabase();

  const postList = await Post.find();
  // const postList = await UserProfiles.find();

  return {
    props: {
      arr: JSON.parse(JSON.stringify(postList)),
    },
  };
}
