import { notification, Input, Typography, Button, Modal } from "antd";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { fetchImages, ImageFE } from "../../api/imageGen";
import ImageGallery from "../../components/ImageGallery";
import mainStyles from "../../index.module.css";
import SuppressedHeader from "../../components/Header/SuppressedHeader";
import styles from "./index.module.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ImageUploader } from "../../components/ImageUploader";
import { useNavigate } from "react-router-dom";

const Search = Input.Search;
const mockQueries = ["Armored Hero"];

const ChooseImage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageFE[]>([]);
  const [lastQuery, setLastQuery] = useLocalStorage<string>(
    "last_img_gen_query",
    ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [advancedModalOpen, setAdvancedModalOpen] = useState<boolean>(false);
  const newMediaDestination = useRef("");

  useEffect(() => {
    searchImages(lastQuery || mockQueries[0]).then((res) => {
      setImages(res);
    });
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
      return [];
    } finally {
      setLoading(false);
      setLastQuery(query);
    }
  };

  const onSearch = () => {
    searchImages(searchValue).then((res) => {
      setImages(res);
    });
  };

  const handleAdvancedOk = () => {
    if (!newMediaDestination.current) {
      notification.error({
        message: "Please upload an image",
      });
      return;
    }
    console.log("newMediaDestination", newMediaDestination.current);

    handleImageSelected(newMediaDestination.current);
  };

  const handleImageSelected = (imageSrc: string) => {
    console.log("image selected", imageSrc);
  };

  return (
    <div className={mainStyles.responsivePageContainer}>
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
          style={{ width: 304 }}
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
        title="Advanced Image Selection"
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
