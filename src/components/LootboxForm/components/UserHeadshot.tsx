import { Button, notification, PopconfirmProps } from "antd";
import { FunctionComponent, useEffect, useRef } from "react";
import styles from "../index.module.css";
import { ImageUploader } from "../../ImageUploader";

export interface UserHeadshotProps {
  // onBack: () => void;
  initialHeadshot?: string;
  onNext: (mediaDestination: string) => void;
  onChange: (mediaDestination: string) => void;
  popConfirmProps: PopconfirmProps;
}

const UserHeadshot: FunctionComponent<UserHeadshotProps> = (props) => {
  const newMediaDestination = useRef<string>(props.initialHeadshot ?? "");
  const formDisabled = !newMediaDestination.current;
  const { onChange } = props;

  useEffect(() => {
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
      <div style={{ width: "100%" }}>
        <ImageUploader
          newMediaDestination={newMediaDestination}
          folderName="player-assets"
          acceptedFileTypes="image/*"
          forceRefresh={() => onChange(newMediaDestination.current)}
          buttonStyle={{
            width: "calc(100vw - 60px)",
            maxWidth: "calc(var(--page-layout-width) - 60px)",
            boxSizing: "border-box",
          }}
        />
      </div>

      <br />
      <div style={{ width: "100%" }}>
        <Button
          type="primary"
          size="large"
          disabled={formDisabled}
          block
          onClick={handleOnNext}
        >
          {newMediaDestination ? "Next" : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default UserHeadshot;
