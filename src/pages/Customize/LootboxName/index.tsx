import { FunctionComponent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_Name,
  CustomizeNavState_ThemeColor,
  RoutesFE,
} from "../../../routes.types";
import LootboxNameForm from "../../../components/LootboxForm/components/LootboxName";

const LootboxName: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_Name } = useLocation();

  useEffect(() => {
    if (!state.coverImage) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (name: string) => {
    const nextState: CustomizeNavState_ThemeColor = {
      name,
      coverImage: state.coverImage,
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
          <LootboxNameForm onBack={handleBack} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default LootboxName;
