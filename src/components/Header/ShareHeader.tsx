import { FunctionComponent } from "react";
import styles from "./index.module.css";

export interface ShareHeaderProps {
  themeColor: string;
}

const ShareHeader: FunctionComponent<ShareHeaderProps> = (props) => {
  return (
    <div
      className={styles.shareHeaderContainer}
      style={{ backgroundColor: props.themeColor }}
    >
      <h1 style={{ backgroundColor: "inherit" }}>SHARE WITH FRIENDS</h1>
      <p>Win them stuff</p>
    </div>
  );
};

export default ShareHeader;
