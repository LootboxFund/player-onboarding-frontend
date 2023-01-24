import { FunctionComponent } from "react";
import styles from "./index.module.css";

export interface EventHeaderProps {
  eventTitle: string;
}

const EventHeader: FunctionComponent<EventHeaderProps> = (props) => {
  return (
    <div className={styles.eventHeaderContainer}>
      <span className={styles.eventSubHeader}>{props.eventTitle}</span>
    </div>
  );
};

export default EventHeader;
