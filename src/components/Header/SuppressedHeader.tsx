import styles from "./index.module.css";

const SuppressedHeader = () => {
  return (
    <div className={styles.suppressedHeaderContainer}>
      <h1>
        <span style={{ fontStyle: "normal" }}>🎁</span> CREATE LOOTBOX
      </h1>
    </div>
  );
};

export default SuppressedHeader;
