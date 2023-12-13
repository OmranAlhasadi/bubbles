import styles from "../css/Feed.module.css";

import TextPost from "../components/TextPost.js";
let feedList = [
  "heyyyyyyy",
  "Testing Posts",
  "Timleine here",
  "hwffffffffffffffffffffffffffffkmkmkxkmkffffffffffffffffffffffffffkmfffffffffffffffffffffffffkmkmkxkmkfffffffffffffffffffffffffffffffffffffffffkmkmkxkmkffffffffffffffffkmkxkmk",
];

const Feed = () => {
  return (
    <div className={styles.container}>
      {feedList.map((text) => (
        <TextPost text={text} />
      ))}
    </div>
  );
};

export default Feed;
