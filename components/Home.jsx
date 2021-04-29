export default function Home({ posts }) {
  return (
    <>
      <div className="home">
        <div className="heading">
          <h1>Welcome!</h1>
          <p>Have a look at some of the posts from the community</p>
        </div>

        <div className="postContainer">
          {posts.map((post) => (
            <SinglePostCard post={post} />
          ))}

          {/* <SinglePostCard post={posts[4]} /> */}
        </div>
      </div>
    </>
  );
}

export function SinglePostCard({ post }) {
  console.log(post);

  const comments = post.comments[0]; // for dev - REMOVE

  return (
    <div key={post._id} className="postCard">
      {post.meta_image ? (
        <div className="imgContainer">
          <img src={post.meta_image} />

          {/* <img src={post.meta_image} /> */}
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
          <p>Comments {post.comments.length}</p>
          <p>Likes {post.likes.length}</p>
        </div>
      </div>

      {comments ? (
        <div className="postCard-singleComment">
          {/* TODO: Have this be clickable, show options to comment on the comment or like or whatever */}

          <div className="userBtn">
            <img src={comments.commenting_user.photo_url} />
            <p>{comments.commenting_user.display_name}</p>
          </div>
          <div className="commentText">
            <p className="date">{comments.date_time}</p>
            <p className="message">{comments.message}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// {
//   "comments": [
//       {
//           "message": "testing - website has a 'share to twitter' button (and Facebook/Linkedin) so it should work!",
//           "_id": "608357bcc067873dd04fff20",
//           "commenting_user": {
//               "_id": "6081b18c780ebe0e2d11c16c",
//               "display_name": "Test1",
//               "photo_url": "https://picsum.photos/100"
//           },
//           "date_time": "2021-04-23T23:26:52.592Z"
//       }
//   ],
//////   "likes": [
//////
//////   ],
//   "_id": "608357bcc067873dd04fff1f",
//   "posting_user": {
//       "_id": "6081b18c780ebe0e2d11c16c",
//       "display_name": "Test1",
//       "photo_url": "https://picsum.photos/100"
//   },
//   "original_url": "https://machinelearningmastery.com/how-to-develop-lstm-models-for-time-series-forecasting/",
////////   "meta_title": "How to Develop LSTM Models for Time Series Forecasting - Machine Learning Mastery",
///////   "meta_description": "Long Short-Term Memory networks, or LSTMs for short, can be applied to time series forecasting. There are many types of […]",
//////   "meta_image": "https://machinelearningmastery.com/wp-content/uploads/2018/11/How-to-Develop-LSTM-Models-for-Time-Series-Forecasting.jpg",
/////   "meta_url": "machinelearningmastery.com",
////   "upload_date": "2021-04-23T23:26:52.559Z",
//   "__v": 0
// }

//////// comments: ["608357bcc067873dd04fff20"]
/////// likes: []
////// meta_description: "Long Short-Term Memory networks, or LSTMs for short, can be applied to time series forecasting. There are many types of […]"
///// meta_image: "https://machinelearningmastery.com/wp-content/uploads/2018/11/How-to-Develop-LSTM-Models-for-Time-Series-Forecasting.jpg"
//// meta_title: "How to Develop LSTM Models for Time Series Forecasting - Machine Learning Mastery"
/// meta_url: "machinelearningmastery.com"
// original_url: "https://machinelearningmastery.com/how-to-develop-lstm-models-for-time-series-forecasting/"
// posting_user: "6081b18c780ebe0e2d11c16c"
// upload_date: "2021-04-23T23:26:52.559Z"
