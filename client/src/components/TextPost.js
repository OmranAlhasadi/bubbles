import styles from "../css/TextPost.module.css";

import { useState, useContext } from "react";

import CommentBox from "./CommentBox";

import { UserContext } from "../contexts/UserContext";
import CommentSection from "./CommentSection";

const TextPost = ({ post, isNew = false, onDelete }) => {
  const [showTextbox, setShowTextbox] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { user, updateUser } = useContext(UserContext);

  const toggleTextbox = () => {
    setShowTextbox((prev) => !prev);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
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
          body: JSON.stringify(commentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post the comment");
      }

      const newComment = await response.json();
      console.log("Comment Posted:", newComment);
    } catch (error) {
      console.error("Error posting comment:", error.message);
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
            <a>{post.author ? post.author.username : "Unknown"}</a>
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
          <button className={styles.smallBtn}>Likes</button>
          <button
            className={styles.smallBtn}
            onClick={toggleComments}
          >{`${post.comments.length} Comments`}</button>
        </div>
        <CommentSection comments={post.comments} isVisible={showComments} />
        <div className={styles.buttonsContainer}>
          <div
            className={`${styles.likeButton} ${
              showTextbox ? styles.isCommenting : ""
            }`}
          >
            <svg className={styles.icon} viewBox="0 0 478.2 478.2">
              <g>
                <path
                  d="M457.575,325.1c9.8-12.5,14.5-25.9,13.9-39.7c-0.6-15.2-7.4-27.1-13-34.4c6.5-16.2,9-41.7-12.7-61.5
          c-15.9-14.5-42.9-21-80.3-19.2c-26.3,1.2-48.3,6.1-49.2,6.3h-0.1c-5,0.9-10.3,2-15.7,3.2c-0.4-6.4,0.7-22.3,12.5-58.1
          c14-42.6,13.2-75.2-2.6-97c-16.6-22.9-43.1-24.7-50.9-24.7c-7.5,0-14.4,3.1-19.3,8.8c-11.1,12.9-9.8,36.7-8.4,47.7
          c-13.2,35.4-50.2,122.2-81.5,146.3c-0.6,0.4-1.1,0.9-1.6,1.4c-9.2,9.7-15.4,20.2-19.6,29.4c-5.9-3.2-12.6-5-19.8-5h-61
          c-23,0-41.6,18.7-41.6,41.6v162.5c0,23,18.7,41.6,41.6,41.6h61c8.9,0,17.2-2.8,24-7.6l23.5,2.8c3.6,0.5,67.6,8.6,133.3,7.3
          c11.9,0.9,23.1,1.4,33.5,1.4c17.9,0,33.5-1.4,46.5-4.2c30.6-6.5,51.5-19.5,62.1-38.6c8.1-14.6,8.1-29.1,6.8-38.3
          c19.9-18,23.4-37.9,22.7-51.9C461.275,337.1,459.475,330.2,457.575,325.1z M48.275,447.3c-8.1,0-14.6-6.6-14.6-14.6V270.1
          c0-8.1,6.6-14.6,14.6-14.6h61c8.1,0,14.6,6.6,14.6,14.6v162.5c0,8.1-6.6,14.6-14.6,14.6h-61V447.3z M431.975,313.4
          c-4.2,4.4-5,11.1-1.8,16.3c0,0.1,4.1,7.1,4.6,16.7c0.7,13.1-5.6,24.7-18.8,34.6c-4.7,3.6-6.6,9.8-4.6,15.4c0,0.1,4.3,13.3-2.7,25.8
          c-6.7,12-21.6,20.6-44.2,25.4c-18.1,3.9-42.7,4.6-72.9,2.2c-0.4,0-0.9,0-1.4,0c-64.3,1.4-129.3-7-130-7.1h-0.1l-10.1-1.2
          c0.6-2.8,0.9-5.8,0.9-8.8V270.1c0-4.3-0.7-8.5-1.9-12.4c1.8-6.7,6.8-21.6,18.6-34.3c44.9-35.6,88.8-155.7,90.7-160.9
          c0.8-2.1,1-4.4,0.6-6.7c-1.7-11.2-1.1-24.9,1.3-29c5.3,0.1,19.6,1.6,28.2,13.5c10.2,14.1,9.8,39.3-1.2,72.7
          c-16.8,50.9-18.2,77.7-4.9,89.5c6.6,5.9,15.4,6.2,21.8,3.9c6.1-1.4,11.9-2.6,17.4-3.5c0.4-0.1,0.9-0.2,1.3-0.3
          c30.7-6.7,85.7-10.8,104.8,6.6c16.2,14.8,4.7,34.4,3.4,36.5c-3.7,5.6-2.6,12.9,2.4,17.4c0.1,0.1,10.6,10,11.1,23.3
          C444.875,295.3,440.675,304.4,431.975,313.4z"
                />
              </g>
            </svg>
            <div className={styles.buttonText}>Like</div>
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
