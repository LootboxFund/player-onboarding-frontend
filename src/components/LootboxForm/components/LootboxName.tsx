import { Button, Input, notification, Typography } from "antd";
import { FunctionComponent, useState } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.css";

export interface LootboxNameProps {
  onBack: () => void;
  onNext: (name: string) => void;
}

const MAX_NAME_LENGTH = 18;

const LootboxName: FunctionComponent<LootboxNameProps> = (props) => {
  const [name, setName] = useState("");

  const handleOnNext = () => {
    if (!name) {
      notification.error({
        message: "Name is required",
      });
      return;
    }
    if (name.length > MAX_NAME_LENGTH) {
      notification.error({
        message: `Name is too long. Cannot exceed ${MAX_NAME_LENGTH} characters.`,
      });
      return;
    }
    props.onNext(name);
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
        &nbsp; Name your Lootbox
      </Typography.Title>
      <br />
      <Input
        size="large"
        value={name}
        onChange={(e) => setName(e.target.value ?? "")}
        placeholder="Enter epic name"
      />
      <br />
      <Button
        type="primary"
        size="large"
        style={{ width: "100%" }}
        onClick={handleOnNext}
      >
        Next
      </Button>
    </div>
  );
};

export default LootboxName;
