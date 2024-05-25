import styles from "../css/CombinedModule.module.css";
import { useState } from "react";
import Modal from "../components/Modal";
import NewUsers from "./NewUsers";
import CreatePostModule from "./CreatePostModule";
const CombinedModule = ({ passNewPost = () => {} }) => {
  const [activeModal, setActiveModal] = useState(null);

  const handleClick = (modalType) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleNewPost = async (newPost) => {
    handleCloseModal();
    await passNewPost(newPost);
  };

  return (
    <div className={styles.container}>
      <div className={styles.newUsers} onClick={() => handleClick("newUsers")}>
        New Users
      </div>
      <div className={styles.newPost} onClick={() => handleClick("newPost")}>
        Create Post
      </div>

      <Modal open={activeModal == "newUsers"} onClose={handleCloseModal}>
        <NewUsers />
      </Modal>

      <Modal open={activeModal == "newPost"} onClose={handleCloseModal}>
        <CreatePostModule passNewPost={handleNewPost} />
      </Modal>
    </div>
  );
};

export default CombinedModule;
