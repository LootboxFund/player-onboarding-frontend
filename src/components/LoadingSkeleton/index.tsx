import { Result, Spin } from "antd";
import { FunctionComponent } from "react";
import rootStyles from "../../index.module.css";
import SuppressedHeader from "../Header/SuppressedHeader";

const LoadingSkeleton: FunctionComponent = () => {
  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader />
      <Result
        icon={
          <Spin size="default" style={{ display: "block", margin: "auto" }} />
        }
      />
    </div>
  );
};

export default LoadingSkeleton;
