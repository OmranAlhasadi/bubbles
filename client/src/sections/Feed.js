import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "../css/Feed.module.css";
import TextPost from "../components/TextPost.js";
import LoadingBubbles from "../components/LoadingBubbles.js";
import TextBox from "../components/TextBox";
import ImagePost from "../components/ImagePost";

import Modal from "../components/Modal";

import CreatePostButton from "../components/CreatePostButton";
import CreatePostModule from "../components/CreatePostModule";

import { UserContext } from "../contexts/UserContext";

import useWindowSize from "../hooks/useWindowSize";
import CombinedModule from "../components/CombinedModule";

import { toast } from "react-toastify";

import LoadingComponent from "../components/LoadingComponent";

const Feed = ({ specificUser = false }) => {
  const { username } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useContext(UserContext);

  //modal stuff
  const [isOpen, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  //rendering combined modal if small screen

  const { width } = useWindowSize();
  const isMobile = width <= 853;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posts`,
          {
            credentials: "include",
          }
        );

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
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posts/${username}`,
          {
            credentials: "include",
          }
        );

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

  const showNewPost = async (newPost) => {
    try {
      closeModal();
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
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Could not delete post");
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

      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting post");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={`${styles.container} disabled`}>
        {isMobile ? (
          !specificUser && <CombinedModule passNewPost={showNewPost} />
        ) : (
          <>
            {!specificUser && <CreatePostButton handleClick={openModal} />}
            <Modal open={isOpen} onClose={closeModal}>
              <CreatePostModule passNewPost={showNewPost} />
            </Modal>
          </>
        )}
        <LoadingComponent text="Loading Posts..." loaderSize="60px" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isMobile ? (
        !specificUser && <CombinedModule passNewPost={showNewPost} />
      ) : (
        <>
          {!specificUser && <CreatePostButton handleClick={openModal} />}
          <Modal open={isOpen} onClose={closeModal}>
            <CreatePostModule passNewPost={showNewPost} />
          </Modal>
        </>
      )}

      {posts.map((post, index) => {
        return post.image ? (
          <ImagePost
            key={post._id}
            post={post}
            isNew={post.isNew ? true : false}
            onDelete={handleDelete}
          />
        ) : (
          <ImagePost
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
