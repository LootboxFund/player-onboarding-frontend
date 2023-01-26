import { notification, Input, Button, Modal, Collapse } from "antd";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { fetchImages, ImageFE } from "../../api/imageGen";
import ImageGallery from "../../components/ImageGallery";
import rootStyles from "../../index.module.css";
import SuppressedHeader from "../../components/Header/SuppressedHeader";
import styles from "./index.module.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ImageUploader } from "../../components/ImageUploader";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomizeNavState_Name, RoutesFE } from "../../routes.types";
import useCustomizeCache from "../../hooks/useCustomizeCache";
import { useEventProvider } from "../../hooks/useEvent/EventProvider";
import EventHeader from "../../components/Header/EventHeader";

const NOTION_PAGE_URL =
  "https://abalone-sundae-008.notion.site/Create-AI-Generated-Lootboxes-fe920d5cd6f64126a8d01d2046fc0c96";

const Search = Input.Search;
const mockQueries = ["Armored Hero"];

const ChooseImage: FunctionComponent = () => {
  const navigate = useNavigate();
  const eventProviderData = useEventProvider();
  const { clearState } = useCustomizeCache();
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
  const newMediaDestination = useRef("");
  const location = useLocation();

  useEffect(() => {
    if (lastImages && lastImages.length > 0) {
      // Use cached images
      setImages(lastImages);
    } else {
      searchImages(lastQuery || mockQueries[0]).then((res) => {
        setImages(res);
        setLastImages(res);
      });
    }
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

  const handleImageSelected = (imageSrc: string) => {
    console.log("clearing state");
    clearState(); // reset the local storage
    console.log("image selected", imageSrc);
    const params: CustomizeNavState_Name = {
      coverImage: imageSrc,
      inviteLinkMetadata:
        eventProviderData && eventProviderData.event
          ? {
              event: eventProviderData.event,
              inviteType: eventProviderData.type,
            }
          : undefined,
    };
    navigate(RoutesFE.CustomizeName, { state: params });
  };

  const navToLogin = () => {
    navigate({ pathname: RoutesFE.Login, search: location.search });
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader />
      {eventProviderData?.event && (
        <EventHeader eventTitle={eventProviderData.event.title} />
      )}
      <ImageGallery
        images={images}
        loading={loading}
        onImageSelected={(e) => handleImageSelected(e.src)}
      />
      <div style={{ height: "200px" }} />
      <div className={styles.floatingButtonContainer}>
        <Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="search for an epic image"
          allowClear
          size="large"
          onSearch={onSearch}
          type="primary"
          style={{
            // filter: "drop-shadow(0px 4px 30px #ffffff)",
            boxShadow: `0px 0px 12px #1668dc`,
          }}
        />
        <br />
        <Collapse bordered={false} ghost style={{ width: "100%" }}>
          <Collapse.Panel header="More options" key="1">
            <ImageUploader
              newMediaDestination={newMediaDestination}
              folderName="player-assets"
              acceptedFileTypes="image/*"
              buttonStyle={{
                width: "calc(100vw - 60px)",
                maxWidth: "calc(var(--page-layout-width) - 60px)",
                boxSizing: "border-box",
              }}
              onChange={handleImageSelected}
            />
            <br />
            <a href={NOTION_PAGE_URL} target="_blank" rel="noreferrer">
              <Button block type="link">
                Create with AI text to image (tutorial)
              </Button>
            </a>
            <br />
            <Button block type="link" onClick={navToLogin}>
              Login
            </Button>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default ChooseImage;
