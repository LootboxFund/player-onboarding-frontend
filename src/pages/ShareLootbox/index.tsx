import { FunctionComponent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareHeader from "../../components/Header/ShareHeader";
import rootStyles from "../../index.module.css";
import styles from "./index.module.css";
import { RoutesFE, ShareLootboxNavState } from "../../routes.types";
import { LootboxID } from "@wormgraph/helpers";

const ShareLootbox: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: ShareLootboxNavState | null } = useLocation();
  const parsedState: ShareLootboxNavState = state || {
    lootbox: {
      id: "" as LootboxID,
      name: "",
      stampImage: "",
      backgroundImage: "",
      themeColor: "#000000",
    },
    userMetadata: {
      headshot: "",
    },
  };

  useEffect(() => {
    if (!state?.lootbox || !state?.userMetadata) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  //   const handleNext = (name: string) => {
  //     const nextState: CustomizeNavState_ThemeColor = {
  //       name,
  //       coverImage: parsedState.coverImage,
  //     };
  //     navigate(RoutesFE.CustomizeThemeColor, {
  //       state: nextState,
  //     });
  //   };

  //   const handleBack = () => {
  //     navigate(-1);
  //   };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <ShareHeader themeColor={parsedState.lootbox.themeColor} />
      <div
        className={styles.customizeMainContainer}
        style={{
          backgroundImage: `url(${parsedState.lootbox.backgroundImage})`,
          backgroundBlendMode: "multiply", // darken it
        }}
      >
        {/* <SimpleTicket
          coverPhoto={parsedState.lootbox.coverImage}
          sponsorLogos={[]}
          teamName={nameCopy}
          themeColor={"#000000"}
          playerHeadshot={undefined}
        /> */}
      </div>
      <div className={styles.scrollSpace} />
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          {/* <LootboxNameForm
            onBack={handleBack}
            onNext={handleNext}
            onChange={setNameCopy}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ShareLootbox;
