import { Button, notification } from "antd";
import { FunctionComponent, useState } from "react";
import styles from "../index.module.css";
import { ChromePicker } from "react-color";
import { isValidHex } from "../../../lib/color";

export interface LootboxThemeColorProps {
  initialValue?: string;
  onNext: (themeColor: string) => void;
  onChange?: (themeColor: string) => void;
  onChangeComplete?: (themeColor: string) => void;
}

const LootboxThemeColor: FunctionComponent<LootboxThemeColorProps> = (
  props
) => {
  const [color, setColor] = useState<string | undefined>(props.initialValue);

  const handleChange = (data: any) => {
    setColor(data?.hex);
    props.onChange && props.onChange(data?.hex);
  };

  const handleChangeComplete = (data: any) => {
    setColor(data?.hex);
    props.onChangeComplete && props.onChangeComplete(data?.hex);
  };

  const handleOnNext = () => {
    const targetColor = color || props.initialValue || "#000000";

    if (!isValidHex(targetColor)) {
      notification.error({
        message: "Invalid hex color",
      });
      return;
    }
    props.onNext(targetColor);
  };

  return (
    <div className={styles.formContainer}>
      <div style={{ width: "100%" }}>
        <ChromePicker
          color={color}
          disableAlpha
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
          styles={{
            default: {
              picker: {
                display: "flex",
                flexDirection: "row",
                width: "100%",
              },
              saturation: {
                paddingBottom: "30%",
                width: "60%",
              },
              color: {
                display: "none",
              },
            },
          }}
        />
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
