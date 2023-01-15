import { FunctionComponent, useEffect } from "react";
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
import { FrontendUser } from "../../../lib/types";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";

const PlayerEmail: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_UserEmail | null } =
    useLocation();
  const parsedState: CustomizeNavState_UserEmail = state || {
    name: "",
    coverImage: "",
    themeColor: "",
  };

  useEffect(() => {
    if (!state?.coverImage || !state?.name || !state?.themeColor) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (user: FrontendUser) => {
    // notification.success({
    //   message: `Welcome ${user?.username ?? "Champion"}`,
    // });
    const nextState: CustomizeNavState_UserHeadshot = {
      name: parsedState.name,
      coverImage: parsedState.coverImage,
      themeColor: parsedState.themeColor,
    };
    navigate(RoutesFE.CustomizePlayerHeadshot, {
      state: nextState,
      replace: true, // If they go back, it will skip this
    });
    return;
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
          backgroundImage: `url(${parsedState.coverImage})`,
          backgroundBlendMode: "multiply", // darken it
          //   filter: "brightness(50%)",
          //   backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <SimpleTicket
          coverPhoto={parsedState.coverImage}
          sponsorLogos={[]}
          teamName={parsedState.name}
          themeColor={parsedState.themeColor}
          playerHeadshot={undefined}
        />

        {/* <MockTicketPreview
          name={state.name}
          coverImage={state.coverImage}
          themeColor={state.themeColor}
        /> */}
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
