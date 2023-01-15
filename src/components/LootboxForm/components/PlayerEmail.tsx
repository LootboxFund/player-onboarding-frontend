import { Button, Input, notification, Typography } from "antd";
import { FunctionComponent, useState } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.css";
import LoginForm from "../../LoginForm";
import { FrontendUser } from "../../../lib/types";

export interface PlayerEmailProps {
  onBack: () => void;
  onNext: (user: FrontendUser) => void;
}

const PlayerEmail: FunctionComponent<PlayerEmailProps> = (props) => {
  const handleOnNext = (user: FrontendUser) => {
    props.onNext(user);
  };

  return (
    <div className={styles.formContainer}>
      <Typography.Title level={4} style={{ width: "100%" }}>
        <Button
          type="text"
          size="large"
          icon={<LeftCircleOutlined />}
          onClick={props.onBack}
        />
        &nbsp; Enter your Email
      </Typography.Title>
      <LoginForm onLoginCallback={handleOnNext} />
    </div>
  );
};

export default PlayerEmail;
