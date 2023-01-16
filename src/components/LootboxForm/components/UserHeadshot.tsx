import {
  Button,
  notification,
  Popconfirm,
  PopconfirmProps,
  // Typography,
} from "antd";
import { FunctionComponent, useEffect, useRef } from "react";
import { LeftCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.css";
import { ImageUploader } from "../../ImageUploader";

export interface UserHeadshotProps {
  // onBack: () => void;
  onNext: (mediaDestination: string) => void;
  onChange: (mediaDestination: string) => void;
  popConfirmProps: PopconfirmProps;
}

const UserHeadshot: FunctionComponent<UserHeadshotProps> = (props) => {
  const newMediaDestination = useRef<string>("");
  const formDisabled = !newMediaDestination.current;
  const { onChange } = props;

  useEffect(() => {
    console.log("media change", newMediaDestination.current);
    onChange(newMediaDestination.current);
  }, [newMediaDestination, onChange]);

  const handleOnNext = () => {
    if (!newMediaDestination.current) {
      notification.error({
        message: "Please upload an image",
      });
      return;
    }

    return props.onNext(newMediaDestination.current);
  };

  return (
    <div className={styles.formContainer}>
      {/* <Typography.Title level={4} style={{ width: "100%" }}>
        <Button
          type="text"
          size="large"
          icon={<LeftCircleOutlined />}
          onClick={props.onBack}
        />
        &nbsp; Upload Selfie (Optional)
      </Typography.Title>
      <br /> */}
      <ImageUploader
        newMediaDestination={newMediaDestination}
        folderName="player-assets"
        acceptedFileTypes="image/*"
        forceRefresh={() => onChange(newMediaDestination.current)}
      />

      <br />
      <div style={{ width: "100%" }}>
        <Popconfirm
          {...props.popConfirmProps}
          onConfirm={handleOnNext}
          disabled={formDisabled}
        >
          <Button type="primary" size="large" disabled={formDisabled} block>
            Upload
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default UserHeadshot;
