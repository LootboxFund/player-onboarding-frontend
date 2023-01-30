import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";
import { uploadImageToFirebase } from "../../api/storage";

interface ImageUploaderProps {
  newMediaDestination: React.MutableRefObject<string>;
  folderName: string;
  acceptedFileTypes: "image/*,video/mp4" | "image/*" | "video/mp4";
  forceRefresh?: () => void;
  buttonStyle?: Partial<React.CSSProperties>;
  buttonProps?: any;
  onUpload?: (file: UploadFile) => void;
  onChange?: (fileUrl: string) => void;
}
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  newMediaDestination,
  folderName,
  acceptedFileTypes = "image/*",
  forceRefresh,
  buttonStyle,
  onChange,
  buttonProps,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const customUploadImage = async ({ file, onSuccess }: any) => {
    if (file.type.indexOf("image") > -1) {
      if (file.size > 10000000) {
        message.error("Image must be under 10MB");
        return;
      }
    }
    const destination = await uploadImageToFirebase({
      folderName,
      file: file,
      folderID: "media",
    });
    newMediaDestination.current = destination;

    if (forceRefresh) {
      forceRefresh();
    }
    onSuccess("ok");

    if (onChange) {
      onChange(destination);
    }
  };

  const handleChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show one recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-1);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  const props = {
    onChange: handleChange,
    multiple: false,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent: any) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Upload
      {...props}
      fileList={fileList}
      listType="text"
      accept={acceptedFileTypes}
      customRequest={customUploadImage}
    >
      <Button
        {...buttonProps}
        size="large"
        block
        icon={<UploadOutlined />}
        style={buttonStyle}
      >
        Upload Image
      </Button>
    </Upload>
  );
};
