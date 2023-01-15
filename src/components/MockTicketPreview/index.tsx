import { Typography } from "antd";
import { FunctionComponent } from "react";
import styles from "./index.module.css";

interface MockTicketPreviewProps {
  name: string;
  themeColor: string;
  coverImage: string;
  headshot?: string;
}

const MockTicketPreview: FunctionComponent<MockTicketPreviewProps> = (
  props
) => {
  return (
    <div
      className={styles.mockTicketPreviewContainer}
      style={{
        filter: `drop-shadow(0px 4px 40px ${props.themeColor})`,
      }}
    >
      <div
        className={styles.mockTicketHeaderSection}
        style={{ backgroundColor: props.themeColor }}
      >
        <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
          {props.name}
        </Typography.Title>
      </div>
      <div
        className={styles.mockTicketBodySection}
        style={{
          backgroundImage: `url(${props.coverImage})`,
        }}
      ></div>
    </div>
  );
};

export default MockTicketPreview;
