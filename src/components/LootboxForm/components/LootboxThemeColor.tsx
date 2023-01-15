import { Button, notification, Typography } from "antd";
import { FunctionComponent, useState } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.css";
import { SliderPicker } from "react-color";
import { isValidHex } from "../../../lib/color";

export interface LootboxThemeColorProps {
  onBack: () => void;
  onNext: (themeColor: string) => void;
  onChange: (themeColor: string) => void;
}

const LootboxThemeColor: FunctionComponent<LootboxThemeColorProps> = (
  props
) => {
  const [color, setColor] = useState<string | undefined>();

  const handleChange = (data: any) => {
    setColor(data?.hex);
    props.onChange(data?.hex);
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
        />
        &nbsp; Change Theme Color
      </Typography.Title>
      <br />
      <div style={{ width: "100%" }}>
        <SliderPicker color={color} onChange={handleChange} />
      </div>
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
