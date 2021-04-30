import { useEffect, useState } from "react";

export default function UploadCommentModal({
  show,
  setShow,
  postId,
  profileId,
}) {
  const [inputText, setInputText] = useState("");
  const [inputLength, setInputLength] = useState(500);

  useEffect(() => {
    if (show) {
      document.querySelector("html").style.overflowY = "hidden";
    } else {
      document.querySelector("html").style.overflowY = "auto";
    }
  }, [show]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputText.length);
  }
  function handleChange(text) {
    setInputText(text);
    setInputLength(500 - text.length);
  }

  return (
    <div className="modal" style={{ display: show ? "flex" : "none" }}>
      <div className="modal-content">
        <div className="modal-header">
          <button className="closeBtn" onClick={() => setShow(false)}>
            &times;
          </button>
          <h2>Add your comment</h2>
        </div>
        <div className="modal-body">
          <form onSubmit={null}>
            <label htmlFor="uploadCommentInput">Enter a comment</label>
            <div>
              <textarea
                id="uploadCommentInput"
                name="uploadCommentInput"
                rows="1"
                maxLength="500"
                value={inputText}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Your comment"
              />
              <p className="staticCounter">{inputLength}</p>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

// It is a long established fact that a reader will be distracted by the
// readable content of a page when looking at its layout. The point of
// using Lorem Ipsum is that it has a more-or-less normal distribution of
// letters, as opposed to using 'Content here, content here', making it
// look like readable English. Many desktop publishing packages and web
// page editors now use Lorem Ipsum as their default model text, and a
// search for 'lorem ipsum' will uncover many web sites still in their
// infancy. Various
