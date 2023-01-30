import { Empty, Result, Spin } from "antd";
import { FunctionComponent, MouseEvent, useMemo } from "react";
import { Gallery, Image } from "react-grid-gallery";
import { ImageFE } from "../../api/imageGen";
import styles from "./index.module.css";

export interface ImageGalleryProps {
  images: ImageFE[];
  loading?: boolean;
  onImageSelected: (image: ImageFE) => void;
}

const ImageGallery: FunctionComponent<ImageGalleryProps> = (
  props: ImageGalleryProps
) => {
  const imgs: Image[] = useMemo(() => {
    return props.images.map((img, idx) => {
      return {
        src: img.src,
        srcSmall: img.srcSmall,
        width: img.width,
        height: img.height,
      };
    });
  }, [props.images]);

  const onClickImage = (
    index: number,
    item: Image,
    event: MouseEvent<HTMLElement>
  ) => {
    const nextImage = props.images[index];
    props.onImageSelected(nextImage);
  };

  if (props.loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin />
      </div>
    );
  }
  if (imgs.length === 0) {
    return (
      <Empty
        image={
          "https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        }
        style={{ color: "#ffffff", marginTop: "50px" }}
      />
    );
  }
  return (
    <Gallery
      images={imgs}
      onClick={onClickImage}
      onSelect={onClickImage}
      enableImageSelection={false}
    />
  );
};

export default ImageGallery;
