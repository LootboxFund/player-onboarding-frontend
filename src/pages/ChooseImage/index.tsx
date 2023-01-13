import { notification, Input } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import { fetchImages, ImageFE } from "../../api/imageGen";
import ImageGallery from "../../components/ImageGallery";
import mainStyles from "../../index.module.css";
import SuppressedHeader from "../../components/Header/SuppressedHeader";
import styles from "./index.module.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const Search = Input.Search;
const mockQueries = ["Armored Hero"];

const ChooseImage: FunctionComponent = () => {
  const [images, setImages] = useState<ImageFE[]>([]);
  const [lastQuery, setLastQuery] = useLocalStorage<string>(
    "last_img_gen_query",
    ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    console.log("INIT USE EFFECT!");
  }, []);

  useEffect(() => {
    console.log("search useEffect");
    searchImages(lastQuery || mockQueries[0]).then((res) => {
      setImages(res);
    });
  }, []);

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

  return (
    <div className={mainStyles.responsivePageContainer}>
      <SuppressedHeader />
      <ImageGallery images={images} loading={loading} />
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
      </div>
    </div>
  );
};

export default ChooseImage;
