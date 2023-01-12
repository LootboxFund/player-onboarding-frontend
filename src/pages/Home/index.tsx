import { FunctionComponent } from "react";
import styles from "./index.module.css";

import HomeComponent from "../../components/HomeComponent";

const HomePage: FunctionComponent = () => {
  return (
    <div className={styles.homePage}>
      LOOTBOX
      <HomeComponent />
    </div>
  );
};

export default HomePage;
