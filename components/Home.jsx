import axios from "axios";
import { useEffect, useState } from "react";
import { ReactComponent as CheckCircle } from "../public/static/icons/checkCircle.svg";
import { ReactComponent as CommentIcon } from "../public/static/icons/commentIcon.svg";
import { ReactComponent as TouchIcon } from "../public/static/icons/handTouch.svg";
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
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newCommentInput, setNewCommentInput] = useState("");

  const comments = post.comments;

  function handleCommentBtn() {
    if (profile._id) {
      setShowCommentInput(!showCommentInput);
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
      await axios.post(`/api/comments`, data);
      setNewCommentInput("");
      setShowCommentInput(false);
      mutate("/api/posts");
      mutate(`api/profiles/${profile._id}`);
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
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

                <CommentButton onClickFunction={handleCommentBtn} />
              </div>

              <div className="utilContainer">
                <p>{post.likes.length}</p>

                <LikeButton
                  data={{
                    type: "post",
                    submitId: post._id,
                    isActive: userLikedPost,
                    onClickFunction: handleLikeBtnPress,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {showCommentInput ? (
          <CommentInputForm
            submitFunction={handleCommentSubmit}
            newCommentInput={newCommentInput}
            setNewCommentInput={setNewCommentInput}
          />
        ) : null}

        {comments.length > 0 ? <hr /> : null}

        {comments &&
          comments.map((comment) => {
            return (
              <SingleComment
                comment={comment}
                key={comment._id}
                profile={profile}
                postId={post._id}
              />
            );
          })}
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

function CommentInputForm(props) {
  const { submitFunction, newCommentInput, setNewCommentInput } = props;

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

  return (
    <div className="postCard-newComment">
      <form onSubmit={submitFunction}>
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
  );
}

function SingleComment({ comment, profile, postId }) {
  const [showCommentSecondary, setShowCommentSecondary] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [newReplyInput, setNewReplyInput] = useState("");

  // if (comment._id === "60820a5e0657d31cc0b13e81") {
  //   console.log(comment);
  // }

  const userLikedComment =
    profile && comment.likes.some((like) => like === profile._id);

  function handleClick() {
    setShowCommentSecondary(!showCommentSecondary);
  }

  async function handleCommentLike(commentId, isActive) {
    const likeData = {
      profileId: profile._id,
      command: isActive ? "remove" : "add",
    };

    try {
      await axios.post(`/api/comments/${commentId}/likes`, likeData);
      mutate("/api/posts");
      mutate(`api/profiles/${profile._id}`);
      console.log("Comment likes updated");
    } catch (error) {
      console.log("Err!", error);
    }
  }

  async function handleReplySubmit(e) {
    e.preventDefault();
    const data = {
      message: newReplyInput,
      commenting_user: profile._id,
      post: postId,
    };

    try {
      await axios.post(`/api/comments/${comment._id}/reply`, data);
      setNewReplyInput("");
      setShowReplyInput(false);
      setShowCommentSecondary(false);
      mutate("/api/posts");
      mutate(`api/profiles/${profile._id}`);
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  return (
    <>
      <div className="commentOuter">
        <div className="postCard-singleComment" onClick={handleClick}>
          <div className="userBtn">
            <img src={comment.commenting_user.photo_url} />
            <p>{comment.commenting_user.display_name}</p>
          </div>

          <div className="commentText">
            <p className="date">{comment.date_time}</p>
            <p className="message">{comment.message}</p>
          </div>

          {/* <div className="touchIcon">
            <TouchIcon />
          </div> */}

          <div className="commentBtns">
            <LikeButton
              data={{
                type: "comment",
                submitId: comment._id,
                isActive: userLikedComment,
                onClickFunction: handleCommentLike,
              }}
            />

            <CommentButton
              onClickFunction={() => setShowReplyInput(!showReplyInput)}
            />
          </div>
        </div>

        {/* {showCommentSecondary ? (
          <div className="commentActions">
            <LikeButton
              data={{
                type: "comment",
                submitId: comment._id,
                isActive: userLikedComment,
                onClickFunction: handleCommentLike,
              }}
            />

            <CommentButton
              onClickFunction={() => setShowReplyInput(!showReplyInput)}
            />
          </div>
        ) : null} */}

        {showReplyInput ? (
          <div>
            <CommentInputForm
              submitFunction={handleReplySubmit}
              newCommentInput={newReplyInput}
              setNewCommentInput={setNewReplyInput}
            />
          </div>
        ) : null}

        {comment.replys.length > 0 &&
          // showCommentSecondary &&
          comment.replys.map((reply) => {
            return <SingleReplyComment key={reply._id} reply={reply} />;
          })}
      </div>
    </>
  );
}

function SingleReplyComment({ reply }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="postCard-singleComment reply"
      onClick={() => setShow(!show)}
    >
      <div className="userBtn">
        <img src={reply.commenting_user.photo_url} />
        <p>{reply.commenting_user.display_name}</p>
      </div>

      <div className="commentText">
        <p className="date">{reply.date_time}</p>
        <p className="message">{reply.message}</p>
      </div>

      <div className="commentBtns">
        <LikeButton
          data={{
            type: "comment",
            submitId: reply._id,
            // isActive: userLikedComment,
            // onClickFunction: handleCommentLike,
          }}
        />

        <div className="touchIcon">
          <TouchIcon />
        </div>
      </div>
    </div>
  );
}

function LikeButton({ data }) {
  const { type, submitId, isActive, onClickFunction } = data;

  return (
    <button
      onClick={() => onClickFunction(submitId, isActive)}
      className={isActive ? "likeCommentBtn fill" : "likeCommentBtn"}
    >
      <CheckCircle />
    </button>
  );
}

function CommentButton({ onClickFunction }) {
  return (
    <button onClick={onClickFunction} className="likeCommentBtn">
      <CommentIcon />
    </button>
  );
}
