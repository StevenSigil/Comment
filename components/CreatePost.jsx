import React, { useState } from "react";
import { getSession } from "next-auth/client";
import axios from "axios";

import ConfirmIcon, { toggleConfAnim } from "./ConfirmIcon";
import LoadingIcon from "./LoadingIcon";

export default function CreatePost() {
  const [inputData, setInputData] = useState({ originalUrl: "", comment: "" });

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const session = await getSession();

    const data = {
      posting_user: session.user.pid,
      original_url: inputData.originalUrl,
      comment: inputData.comment,
    };

    const res = await axios.post(`/api/posts`, { data }).catch((e) => {
      console.log(e);
      setLoading(false);
      return null;
    });

    setLoading(false);

    console.log(res);
    if (res && res.status >= 200 < 300) {
      setInputData({ originalUrl: "", comment: "" });
      toggleConfAnim();
    }
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

      {loading ? <LoadingIcon /> : <ConfirmIcon />}
    </>
  );
}
