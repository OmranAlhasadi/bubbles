import styles from "../css/TextPost.module.css";

import { useState, useContext } from "react";

import CommentBox from "./CommentBox";

import { UserContext } from "../contexts/UserContext";
import CommentSection from "./CommentSection";

const TextPost = ({ post, isNew = false, onDelete }) => {
  const [showTextbox, setShowTextbox] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments);

  const { user, updateUser } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user.username));
  const [isLikeHovered, setIsLikeHovered] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);

  const toggleTextbox = () => {
    setShowTextbox((prev) => !prev);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const toggleLikeButton = () => {
    setIsLiked((prev) => !prev);
  };

  const handleLikeButton = async () => {
    const data = { userId: user._id };

    if (!isLiked) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/posts/${post._id}/like`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to like the post");
        }

        toggleLikeButton();
        setLikeCount((prev) => ++prev);
      } catch (error) {
        console.error("Error liking post:", error.message);
      }
    } else if (isLiked) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/posts/${post._id}/like`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to unlike the post");
        }

        toggleLikeButton();
        setLikeCount((prev) => --prev);
      } catch (error) {
        console.error("Error unliking post:", error.message);
      }
    } else {
      console.log("Error handling liked state");
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const onDeleteClick = () => {
    onDelete(post._id);
  };

  const postComment = async (commentText) => {
    const commentData = {
      authorID: user._id,
      content: commentText,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/api/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post the comment");
      }

      let newComment = await response.json();
      newComment.isNew = true;
      setComments((prev) => [...prev, newComment]);
      setCommentCount((prev) => ++prev);
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      // Delete request
      const response = await fetch(
        `http://localhost:3001/api/posts/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not delete comment");
      }

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, deleting: true } : comment
        )
      );

      // Wait for the animation to complete after successful comment deletion
      setTimeout(async () => {
        // Remove post from state
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      }, 500); //duration to wait for animation to finish
      setCommentCount((prev) => --prev);
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const likeSVG = (
    <svg className={styles.icon} viewBox="0 0 16 16">
      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
    </svg>
  );

  const unlikeSVG = (
    <svg className={styles.icon} viewBox="0 0 16 16">
      <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1" />
    </svg>
  );

  const handleMouseEnter = () => {
    setIsLikeHovered(true);
  };

  const handleMouseLeave = () => {
    setIsLikeHovered(false);
  };

  // Function to render SVG based on like and hover state
  const renderLikeSVG = () => {
    if (isLiked && isLikeHovered) {
      return unlikeSVG;
    } else {
      /*else if (isLiked) {
      return unlikeSVG;
    } else if (isHovered) {
      return unlikeSVG;
    }*/
      return likeSVG;
    }
  };

  return (
    <div
      className={`${styles.wrapper} ${isNew ? styles.newPost : ""} ${
        post.deleting ? styles.deleting : ""
      }`}
    >
      <div className={styles.container}>
        <div className={styles.postHeader}>
          <div className={styles.info}>
            <img className={styles.profile} src={post.author.profileImg}></img>
            <a href={`/profile/${post.author.username}`}>
              {post.author ? post.author.username : "Unknown"}
            </a>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.author && post.author.username === user.username && (
            <svg
              className={styles.trash}
              onClick={onDeleteClick}
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          )}
        </div>
        <p className={styles.textBox}>{post.content}</p>
        <div className={styles.smallBtnContainer}>
          <button className={styles.smallBtn}>{`${likeCount} Likes`}</button>
          <button
            className={styles.smallBtn}
            onClick={toggleComments}
          >{`${commentCount} Comments`}</button>
        </div>
        <CommentSection
          comments={comments}
          isVisible={showComments}
          handleCommentDelete={handleCommentDelete}
        />
        <div className={styles.buttonsContainer}>
          <div
            className={`${styles.likeButton} ${
              showTextbox ? styles.isCommenting : ""
            }    ${isLiked ? styles.liked : ""} `}
            onClick={handleLikeButton}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {renderLikeSVG()}
            <div className={styles.buttonText}>
              {isLiked ? "Unlike" : "Like"}
            </div>
          </div>
          <div
            className={`${styles.commentButton} ${
              showTextbox ? styles.isCommenting : ""
            }`}
            onClick={toggleTextbox}
          >
            <svg className={styles.icon} viewBox="0 0 16 16">
              <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
            </svg>
            <div className={styles.buttonText}>Comment</div>
          </div>
        </div>
      </div>

      <CommentBox
        borderRadius="0 0 25px 25px"
        isVisible={showTextbox}
        handleSubmit={(commentText) => postComment(commentText)}
      />
    </div>
  );
};

export default TextPost;
