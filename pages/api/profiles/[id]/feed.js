import { connectToDatabase } from "../../../../util/mongodb";
import UserProfiles from "../../../../models/profileModel";
import Posts from "../../../../models/postModel";
import Comments from "../../../../models/commentModel";

/**
 * .../api/profiles/<UserProfile._id>/feed
 *
 * API endpoint to display posts on a user's feed. Posts are expected
 * to include posts a user liked, commented on, and posted.
 *
 */

export default async (req, res) => {
  await connectToDatabase();

  const profileId = req.query.id;

  const singleProfile = await UserProfiles.findById(profileId)
    .select("posts")
    .populate({
      path: "posts",
      select:
        "meta_image meta_title meta_url meta_description upload_date comments likes",
      model: Posts,
      options: { sort: { upload_date: -1 } },
    })
    .select("comments")
    .populate({
      path: "comments",
      select: "message date_time post",
      model: Comments,
      options: { sort: { date_time: -1 } },
      populate: {
        path: "post",
        select:
          "meta_image meta_title meta_url meta_description upload_date comments likes",
        model: Posts,
      },
    })
    .select("liked_posts")
    .populate({
      path: "liked_posts.post",
      select:
        "meta_image meta_title meta_url meta_description upload_date comments likes",
      model: Posts,
    });

  // prepped data for POSTS SECTION
  const postsSection = singleProfile.posts.map((post) => {
    const newPost = prepPost(post);
    return {
      post: newPost,
      sort_time: post.upload_date,
      type: "post",
    };
  });

  // prepped data for COMMENTS SECTION
  const commentsSection = singleProfile.comments.map((comment) => {
    const newPost = prepPost(comment.post);
    return {
      post: newPost,
      message: comment.message,
      sort_time: comment.date_time,
      type: "comment",
    };
  });

  // prepped data for LIKED_POSTS SECTION
  const likedPostsSection = singleProfile.liked_posts.map((post) => {
    const newPost = prepPost(post.post);
    return {
      post: newPost,
      sort_time: post.date_time,
      type: "like",
    };
  });

  // Sort by 'sort_date' ALL activity items
  const unsortedArr = [];

  postsSection.forEach((entry) => {
    unsortedArr.push(entry);
  });
  commentsSection.forEach((entry) => {
    unsortedArr.push(entry);
  });
  likedPostsSection.forEach((entry) => {
    unsortedArr.push(entry);
  });

  const finalArr = unsortedArr.sort((a, b) => {
    a = new Date(a.sort_time);
    b = new Date(b.sort_time);
    return b - a;
  });

  return res.status(200).json(finalArr);
};

function prepPost(post) {
  if (post) {
    const commentLength = post.comments.length;
    const likesLength = post.likes.length;

    const newPost = {
      comments: commentLength,
      likes: likesLength,
      _id: post._id,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      meta_image: post.meta_image,
      meta_url: post.meta_url,
      upload_date: post.upload_date,
    };

    return newPost;
  }
  return null;
}
