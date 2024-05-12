import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "../css/Feed.module.css";
import TextPost from "../components/TextPost.js";
import LoadingBubbles from "../components/LoadingBubbles.js";
import TextBox from "../components/TextBox";
import ImagePost from "../components/ImagePost";

import Modal from "../components/Modal";

import CreatePostButton from "../components/CreatePostButton";

import { UserContext } from "../contexts/UserContext";

const Feed = ({ specificUser = false }) => {
  const { username } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useContext(UserContext);

  //modal stuff
  const [isOpen, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const imagePost = {
    author: {
      _id: "658547c066a8a4479498d869",
      username: "Janae_Kuhn",
      profileImg:
        "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/831.jpg",
    },
    comments: [],
    content:
      "Vesco modi volutabrum expedita ustilo vitiosus delego coepi desino voluptates. Demo tondeo defleo uredo vilis absum. Benigne campana turpis vorax ipsa compello veniam coerceo.",
    createdAt: "2023-12-29T07:51:41.728Z",
    image: "https://picsum.photos/seed/fd0jRxJTj/640/480",
    likes: [],
    likesCount: 0,

    _id: "658e7a8d59d69b59d6ab5a94",
  };

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
        console.log(posts);
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
      {!specificUser && <CreatePostButton handleClick={openModal} />}
      <Modal open={isOpen} onClose={closeModal}>
        <p>This is the modal content!</p>
      </Modal>
      <ImagePost
        key={imagePost._id}
        post={imagePost}
        isNew={imagePost.isNew ? true : false}
        onDelete={handleDelete}
      />
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
