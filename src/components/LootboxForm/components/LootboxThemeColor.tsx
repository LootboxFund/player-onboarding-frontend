import { Button, notification } from "antd";
import { FunctionComponent, useState } from "react";
// import { LeftCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.css";
import { ChromePicker, SliderPicker } from "react-color";
import { isValidHex } from "../../../lib/color";

export interface LootboxThemeColorProps {
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
      <div style={{ width: "100%" }}>
        <ChromePicker color={color} onChange={handleChange} />
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
