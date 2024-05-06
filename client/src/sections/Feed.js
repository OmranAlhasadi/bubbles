import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "../css/Feed.module.css";
import TextPost from "../components/TextPost.js";
import LoadingBubbles from "../components/LoadingBubbles.js";
import TextBox from "../components/TextBox";

import { UserContext } from "../contexts/UserContext";

const Feed = ({ specificUser = false }) => {
  const { username } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/posts", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async (username) => {
      try {
        const response = await fetch("http://localhost:3001/api/posts", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Could not fetch user posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (specificUser === false) {
      fetchPosts();
    } else {
      fetchUserPosts(username);
    }
  }, []);

  const createPost = async (content) => {
    try {
      const postBody = {
        content: content,
      };

      const response = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(postBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let newPost = await response.json();
      newPost.isNew = true;
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("error creating post", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      // Delete request
      const response = await fetch(
        `http://localhost:3001/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Could not delete post");
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, deleting: true } : post
        )
      );

      // Wait for the animation to complete after successful post deletion
      setTimeout(async () => {
        // Remove post from state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      }, 500); //duration to wait for animation to finish
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  if (loading) {
    return <LoadingBubbles />;
  }

  return (
    <div className={styles.container}>
      {!specificUser && <TextBox onSubmit={createPost} />}
      {posts.map((post, index) => {
        return (
          <TextPost
            key={post._id}
            post={post}
            isNew={post.isNew ? true : false}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
};

export default Feed;
