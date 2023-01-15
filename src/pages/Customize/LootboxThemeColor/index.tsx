import { FunctionComponent, useEffect } from "react";
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

const LootboxThemeColor: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_ThemeColor } = useLocation();

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
        }}
      ></div>
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <LootboxThemeColorForm onBack={handleBack} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default LootboxThemeColor;
