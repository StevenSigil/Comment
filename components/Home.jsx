import axios from "axios";
import { useEffect, useState } from "react";
import { ReactComponent as CheckCircle } from "../public/static/icons/checkCircle.svg";
import { ReactComponent as CommentIcon } from "../public/static/icons/commentIcon.svg";
// import UploadCommentModal from "./UploadCommentModal";

import useSWR, { mutate } from "swr";
import { useUserProfile } from "../util/swrHooks";

const SERVER = process.env.SERVER;

export default function Home({ posts, profileId }) {
  const { profile, loadingProfile, errorProfile } = useUserProfile(profileId);

  async function handleLikeBtnPress(postId, userAlreadyLiked) {
    if (profile) {
      // Add or remove depending on current status of like & user relation
      const urlCommand = userAlreadyLiked ? "remove" : "add";

      await axios.post(`${SERVER}/api/posts/${postId}/likes`, {
        profileId: profile._id,
        command: urlCommand,
      });
      // refresh the SWR posts state
      mutate("/api/posts");
      mutate(`api/profiles/${profile._id}`);
    } else {
      console.log(errorProfile);
    }
  }

  return (
    <>
      {loadingProfile ? (
        <div className="home">
          <div className="heading">
            <p>Loading Profile...</p>
          </div>
        </div>
      ) : (
        <div className="home">
          <div className="heading">
            <h1>Welcome!</h1>
            <p>Have a look at some of the posts from the community</p>
          </div>

          <div className="postContainer">
            {posts.map((post) => (
              <SinglePostCard
                key={post._id}
                post={post}
                profile={profile}
                handleLikeBtnPress={handleLikeBtnPress}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function SinglePostCard({ post, profile, handleLikeBtnPress }) {
  const [newCommentInput, setNewCommentInput] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const comments = post.comments;

  function handleNewComment() {
    if (profile._id) {
      setShowCommentInput(true);
    } else {
      // User is not signed in!!!
      alert("You must be signed in to comment on this post.");
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();

    const data = {
      message: newCommentInput,
      commenting_user: profile._id,
      post: post._id,
    };

    try {
      const x = await axios.post(`${SERVER}/api/comments`, data);
      console.log(x.data);
      setNewCommentInput("");
      setShowCommentInput(false);
      mutate("/api/posts");
      mutate(`api/profiles/${profile._id}`);
    } catch (error) {
      throw Error(error);
    }
  }

  function handleCommentTextChange(e) {
    const target = e.target;

    if (target.value.length < 10) {
      e.target.rows = "2";
    } else {
      target.style.height = "auto";
      const height = Math.abs(Math.round(target.scrollHeight / 30));
      e.target.rows = height;
    }
    setNewCommentInput(e.target.value);
  }

  // Checks if the curUser liked this Post instance and changes display
  const userLikedPost =
    profile && post.likes.some((like) => like._id === profile._id);

  return (
    <>
      <div className="postCard">
        {post.meta_image ? (
          <div className="imgContainer">
            <img src={post.meta_image} />
          </div>
        ) : null}

        <div className="postCard-textHeading">
          <div className="left">
            <h2>{post.meta_title}</h2>
            <p className="subText">{post.meta_url}</p>
            <p>{post.meta_description}</p>
          </div>
          <div className="right">
            <p>
              Uploaded {new Date(post.upload_date).toLocaleDateString()}{" "}
              {new Date(post.upload_date).toLocaleTimeString()}
            </p>

            <div className="likeCommentContainer">
              <div className="utilContainer">
                <p>{post.comments.length}</p>
                <button onClick={handleNewComment}>
                  <CommentIcon />
                </button>
              </div>

              <div className="utilContainer">
                <p>{post.likes.length}</p>
                <button
                  onClick={() => handleLikeBtnPress(post._id, userLikedPost)}
                  className={userLikedPost ? "fill" : ""}
                >
                  <CheckCircle />
                </button>
              </div>
            </div>
          </div>
        </div>

        {comments.length > 0 ? <hr /> : null}

        {comments &&
          comments.map((comment) => {
            return (
              <div key={comment._id} className="postCard-singleComment">
                {/* TODO: Have this be clickable, show options to comment on the comment or like or whatever */}

                <div className="userBtn">
                  <img src={comment.commenting_user.photo_url} />
                  <p>{comment.commenting_user.display_name}</p>
                </div>
                <div className="commentText">
                  <p className="date">{comment.date_time}</p>
                  <p className="message">{comment.message}</p>
                </div>
              </div>
            );
          })}

        <div
          className="postCard-newComment"
          style={{ display: showCommentInput ? "block" : "none" }}
        >
          <form onSubmit={handleCommentSubmit}>
            <label htmlFor="commentInput">Share your thoughts</label>
            <textarea
              id="commentInput"
              value={newCommentInput}
              onChange={handleCommentTextChange}
              placeholder="Your comment"
              maxLength="500"
              rows="2"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* <UploadCommentModal
        show={showUpComMod}
        setShow={setShowUpComMod}
        postId={post._id}
        profileId={profileId}
      /> */}
    </>
  );
}
