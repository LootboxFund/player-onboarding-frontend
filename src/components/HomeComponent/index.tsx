import { Button } from "antd";
import { FunctionComponent } from "react";
import styles from "./index.module.css";

const HomeComponent: FunctionComponent = () => {
  return (
    <div className={styles.homeComponentContainer}>
      Hello World
      <Button type="primary">Primary Button</Button>
    </div>
  );
};

export default HomeComponent;
