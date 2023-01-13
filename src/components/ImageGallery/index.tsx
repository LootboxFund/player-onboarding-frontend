import { Empty, Result, Spin } from "antd";
import { FunctionComponent, MouseEvent, useMemo } from "react";
import { Gallery, Image } from "react-grid-gallery";
import { ImageFE } from "../../api/imageGen";
import styles from "./index.module.css";

export interface ImageGalleryProps {
  images: ImageFE[];
  loading?: boolean;
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
    console.log("select image", index, item, event);
    // const nextImages = props.images.map((image, i) =>
    //   i === index ? { ...image, isSelected: !image.isSelected } : image
    // );
    // return nextImages;
  };

  console.log("imgs", imgs);
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
  return <Gallery images={imgs} onClick={onClickImage} />;
};

export default ImageGallery;
