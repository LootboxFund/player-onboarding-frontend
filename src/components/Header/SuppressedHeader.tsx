import styles from "./index.module.css";

export interface SuppressedHeaderProps {
  title?: string;
}
const SuppressedHeader = (props: SuppressedHeaderProps) => {
  return (
    <div className={styles.suppressedHeaderContainer}>
      <h1>
        <span style={{ fontStyle: "normal" }}>🎁</span>{" "}
        {props.title ?? "CREATE LOOTBOX"}
      </h1>
    </div>
  );
};

export default SuppressedHeader;
