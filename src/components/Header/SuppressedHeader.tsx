import styles from "./index.module.css";

const SuppressedHeader = () => {
  return (
    <div className={styles.SuppressedHeaderContainer}>
      <h1>
        <span style={{ fontStyle: "normal" }}>🎁</span> LOOTBOX
      </h1>
    </div>
  );
};

export default SuppressedHeader;
