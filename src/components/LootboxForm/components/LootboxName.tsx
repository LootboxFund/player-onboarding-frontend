import { Button, Input, notification } from "antd";
import { FunctionComponent, useState } from "react";
import styles from "../index.module.css";

export interface LootboxNameProps {
  initialValue?: string;
  onNext: (name: string) => void;
  onChange: (name: string) => void;
}

export const PLACEHOLDER_NAME = "Player";
const MAX_NAME_LENGTH = 18;

const LootboxName: FunctionComponent<LootboxNameProps> = (props) => {
  const [name, setName] = useState(props.initialValue ?? "");

  const handleOnNext = () => {
    const targetName = name || PLACEHOLDER_NAME;

    if (!targetName) {
      notification.error({
        message: "Name is required",
      });
      return;
    }
    if (targetName.length > MAX_NAME_LENGTH) {
      notification.error({
        message: `Name is too long. Cannot exceed ${MAX_NAME_LENGTH} characters.`,
      });
      return;
    }
    props.onNext(targetName);
  };

  const handleOnChange = (newName: string) => {
    setName(newName);
    props.onChange(newName);
  };

  return (
    <div className={styles.formContainer}>
      <Input
        size="large"
        value={name}
        onChange={(e) => handleOnChange(e.target.value ?? "")}
        placeholder="Enter epic name"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOnNext();
          }
        }}
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
