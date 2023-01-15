import { notification, Input, Button, Modal } from "antd";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { fetchImages, ImageFE } from "../../api/imageGen";
import ImageGallery from "../../components/ImageGallery";
import rootStyles from "../../index.module.css";
import SuppressedHeader from "../../components/Header/SuppressedHeader";
import styles from "./index.module.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ImageUploader } from "../../components/ImageUploader";
import { useNavigate } from "react-router-dom";
import { CustomizeNavState_Name, RoutesFE } from "../../routes.types";

const Search = Input.Search;
const mockQueries = ["Armored Hero"];

const ChooseImage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageFE[]>([]);
  const [lastQuery, setLastQuery] = useLocalStorage<string>(
    "last_img_gen_query",
    ""
  );
  const [lastImages, setLastImages] = useLocalStorage<ImageFE[]>(
    "last_imgs_fetched",
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [advancedModalOpen, setAdvancedModalOpen] = useState<boolean>(false);
  const newMediaDestination = useRef("");

  useEffect(() => {
    if (lastImages) {
      // Use cached images
      setImages(lastImages);
    } else {
      searchImages(lastQuery || mockQueries[0]).then((res) => {
        setImages(res);
        setLastImages(res);
      });
    }
  }, []);

  const toggleModal = () => {
    setAdvancedModalOpen(!advancedModalOpen);
  };

  const searchImages = async (query: string) => {
    console.log("searching...");
    setLoading(true);
    try {
      const res = await fetchImages(query);
      return res;
    } catch (err) {
      console.error(err);
      notification.error({
        message: "An error occured. Please try again later.",
      });
      if (lastImages.length > 0) {
        return lastImages;
      }
      return [];
    } finally {
      setLoading(false);
      setLastQuery(query);
    }
  };

  const onSearch = () => {
    searchImages(searchValue).then((res) => {
      setImages(res);
      setLastImages(res);
    });
  };

  const handleAdvancedOk = () => {
    if (!newMediaDestination.current) {
      notification.error({
        message: "Please upload an image",
      });
      return;
    }

    handleImageSelected(newMediaDestination.current);
  };

  const handleImageSelected = (imageSrc: string) => {
    console.log("image selected", imageSrc);
    const params: CustomizeNavState_Name = {
      coverImage: imageSrc,
    };
    navigate(RoutesFE.CustomizeName, { state: params });
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader />
      <ImageGallery
        images={images}
        loading={loading}
        onImageSelected={(e) => handleImageSelected(e.src)}
      />
      <div className={styles.floatingButtonContainer}>
        <Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="search for an epic image"
          allowClear
          size="large"
          onSearch={onSearch}
        />
        <div className={styles.advancedContainer}>
          <Button type="text" onClick={toggleModal}>
            Advanced
          </Button>
        </div>
      </div>
      <Modal
        open={advancedModalOpen}
        onCancel={toggleModal}
        title="Upload your own image"
        onOk={handleAdvancedOk}
      >
        <ImageUploader
          newMediaDestination={newMediaDestination}
          folderName="player-assets"
          acceptedFileTypes="image/*"
        />
      </Modal>
    </div>
  );
};

export default ChooseImage;
