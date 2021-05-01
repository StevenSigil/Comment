import axios from "axios";
import React, { useState } from "react";

export default function CreatePost() {
  const [inputData, setInputData] = useState({ originalUrl: "", comment: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setInputData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const SERVER = process.env.server;
    const data = {
      posting_user: "",
      original_url: inputData.originalUrl,
      comment: inputData.comment,
    };
    // TODO: get posting userProfile._id to post this request!!!

    // const res = await axios
    //   .post(`${SERVER}/api/posts`, { data })
    //   .catch((e) => console.log(e));

    // setInputData({ originalUrl: "", comment: "" });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a URL to comment on"
          name="originalUrl"
          value={inputData.originalUrl}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Say what you want"
          name="comment"
          value={inputData.comment}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
