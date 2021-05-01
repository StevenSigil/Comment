// Page showing a chronologically ordered list of posts a user has posted,
//  liked & commented on (mixed together by date uploaded/liked/commented)

import UserProfiles from "../../models/profileModel";
import { connectToDatabase } from "../../util/mongodb";
import { useUserFeed } from "../../util/swrHooks";

import PostCard from "../../components/temp/PostCard";

export default function userFeed({ initProfile }) {
  const { feed, loadingFeed, errorFeed } = useUserFeed(initProfile._id);
  console.log(initProfile);

  return (
    <div className="userFeed">
      <h1>{initProfile.display_name}</h1>

      {loadingFeed ? (
        <h3> LOADING... </h3>
      ) : (
        <>
          {feed &&
            feed.map((item, index) => {
              var index = index + 1;
              return (
                <PostCard
                  key={index}
                  post={item.post}
                  actionType={item.type}
                  message={item.message}
                  basicProfile={initProfile}
                />
              );
            })}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  await connectToDatabase();
  const profile = await UserProfiles.findById(context.query.id).select(
    "display_name"
  );

  return {
    props: {
      initProfile: JSON.parse(JSON.stringify(profile)),
    },
  };
}
