import { Button, Input, notification, Typography } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.css";
import { ChromePicker } from "react-color";
import { isValidHex } from "../../../lib/color";

export interface LootboxThemeColorProps {
  initialColor?: string;
  onBack: () => void;
  onNext: (themeColor: string) => void;
}

const DEFAULT_THEME_COLOR = "#000000";

const LootboxThemeColor: FunctionComponent<LootboxThemeColorProps> = (
  props
) => {
  const [color, setColor] = useState(props.initialColor ?? DEFAULT_THEME_COLOR);

  const handleChangeComplete = (data: any) => {
    console.log(`chrome color picker data`, data.hex);
    setColor(data.hex);
  };

  const handleOnNext = () => {
    if (!color) {
      notification.error({
        message: "Name is required",
      });
      return;
    }
    if (!isValidHex(color)) {
      notification.error({
        message: "Invalid hex color",
      });
      return;
    }
    props.onNext(color);
  };

  return (
    <div className={styles.formContainer}>
      <Typography.Title level={4} style={{ width: "100%" }}>
        <Button
          type="text"
          size="large"
          icon={<LeftCircleOutlined />}
          onClick={props.onBack}
        />{" "}
        Change Theme Color
      </Typography.Title>
      <br />
      <ChromePicker color={color} onChange={handleChangeComplete} />
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

export default LootboxThemeColor;
