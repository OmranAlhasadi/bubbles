import React, { useState, useEffect } from "react";
import styles from "../css/Feed.module.css";
import TextPost from "../components/TextPost.js";
import LoadingBubbles from "../components/LoadingBubbles.js";

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

  if (loading) {
    return <LoadingBubbles />;
  }

  return (
    <div className={styles.container}>
      {posts.map((post, index) => (
        <TextPost key={index} post={post} />
      ))}
    </div>
  );
};

export default Feed;
