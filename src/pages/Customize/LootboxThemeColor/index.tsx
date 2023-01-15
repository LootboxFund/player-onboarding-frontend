import { FunctionComponent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_ThemeColor,
  CustomizeNavState_UserEmail,
  RoutesFE,
} from "../../../routes.types";
import { LootboxThemeColorForm } from "../../../components/LootboxForm";
import MockTicketPreview from "../../../components/MockTicketPreview";

const LootboxThemeColor: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_ThemeColor } = useLocation();
  const [themeColorCopy, setThemeColorCopy] = useState<string>();

  useEffect(() => {
    if (!state.coverImage || !state.name) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (color: string) => {
    const nextState: CustomizeNavState_UserEmail = {
      name: state.name,
      coverImage: state.coverImage,
      themeColor: color,
    };
    navigate(RoutesFE.CustomizeThemeColor, {
      state: nextState,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader />
      <div
        className={styles.customizeMainContainer}
        style={{
          backgroundImage: `url(${state.coverImage})`,
          backgroundBlendMode: "multiply", // darken it
          //   filter: "brightness(50%)",
          //   backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <MockTicketPreview
          name={state.name}
          coverImage={state.coverImage}
          themeColor={themeColorCopy || "#000000"}
        />
      </div>
      <div className={styles.scrollSpace} />
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <LootboxThemeColorForm
            onBack={handleBack}
            onNext={handleNext}
            onChange={setThemeColorCopy}
          />
        </div>
      </div>
    </div>
  );
};

export default LootboxThemeColor;
