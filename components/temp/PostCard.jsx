import Link from "next/link";
import { ReactComponent as CheckCircle } from "../../public/static/icons/checkCircle.svg";
import { ReactComponent as CommentIcon } from "../../public/static/icons/commentIcon.svg";

const SERVER = process.env.SERVER;

/**
 * Card used in '/feed/<ProfileId>' frontend route to display a user's interaction with a
 * post. Comments are omitted at this time.
 */
export default function PostCard({ post, actionType, message, basicProfile }) {
  var action = "";

  if (post) {
    switch (actionType) {
      case "like":
        action = "liked";
        break;
      case "post":
        action = "shared";
        break;
      case "comment":
        action = "commented on";
        break;

      default:
        break;
    }
  }

  return (
    <div className="feedCard">
      <div className="userActionText">
        <p>
          <span>{basicProfile.display_name}</span> {action} this!
        </p>

        <div className="commentText">
          <blockquote cite={`${SERVER}/feed/${basicProfile._id}`}>
            <p>{message}</p>
          </blockquote>
        </div>
      </div>

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
              <div className="">
                <p>{post.comments}</p>
                <CommentIcon />
              </div>
              
              <div className="">
                <p>{post.comments}</p>
                <CheckCircle />
              </div>
            </div>
            <div className="utilContainer toPost">
              {/*  */}
              {/* TODO: have this button go to the single page post!! */}
              <button>Go to post</button>
            </div>
          </div>
        </div>
      </div>

      {/* {actionType === "comment" ? (
        <>
          <hr />

          {comments &&
            comments.map((comment) => {
              return (
                <div key={comment._id} className="postCard-singleComment">
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
        </>
      ) : null} */}

      {/* {comments.length > 0 ? <hr /> : null}

      {comments &&
        comments.map((comment) => {
          return (
            <div key={comment._id} className="postCard-singleComment">
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
        })} */}

      {/* <div
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
      </div> */}
    </div>
  );
}
