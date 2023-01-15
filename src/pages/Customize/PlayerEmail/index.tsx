import { FunctionComponent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_UserEmail,
  CustomizeNavState_UserHeadshot,
  RoutesFE,
} from "../../../routes.types";
import { PlayerEmailForm } from "../../../components/LootboxForm";
import MockTicketPreview from "../../../components/MockTicketPreview";
import { message, notification } from "antd";
import { FrontendUser } from "../../../hooks/useAuth/AuthProvider";

const PlayerEmail: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_UserEmail } = useLocation();

  useEffect(() => {
    if (!state.coverImage || !state.name || !state.themeColor) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (user: FrontendUser) => {
    notification.success({
      message: `Welcome ${user?.username ?? "POG Champion"}`,
    });
    const nextState: CustomizeNavState_UserHeadshot = {
      name: state.name,
      coverImage: state.coverImage,
      themeColor: state.themeColor,
    };
    // navigate(RoutesFE.CustomizeThemeColor, {
    //   state: nextState,
    // });
    console.log("done");
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
          themeColor={state.themeColor}
        />
      </div>
      <div className={styles.scrollSpace} />
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <PlayerEmailForm onBack={handleBack} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default PlayerEmail;
