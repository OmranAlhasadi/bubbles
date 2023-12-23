import React, { useState, useEffect } from "react";
import styles from "../css/Feed.module.css";
import TextPost from "../components/TextPost.js";
import LoadingBubbles from "../components/LoadingBubbles.js";
import TextBox from "../components/TextBox";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/posts");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const createPost = async (content) => {
    try {
      const postBody = {
        authorID: "658675ce96eb5ca36fc1ea7f",
        content: content,
      };

      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let newPost = await response.json();
      newPost.uniqueKey = Date.now(); // unique value for key so the post expanding animation works on new posts and (older) new posts will not retain the isNew class on rerenders.
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("error creating post", error);
    }
  };

  if (loading) {
    return <LoadingBubbles />;
  }

  return (
    <div className={styles.container}>
      <TextBox onSubmit={createPost} />
      {posts.map((post, index) => {
        return (
          <TextPost
            key={post.uniqueKey || post._id}
            post={post}
            isNew={post.uniqueKey ? true : false}
          />
        );
      })}
    </div>
  );
};

export default Feed;
