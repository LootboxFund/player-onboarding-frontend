import { FunctionComponent, useCallback, useEffect } from "react";
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
import { message } from "antd";
import { useAuth } from "../../../hooks/useAuth";
import EventHeader from "../../../components/Header/EventHeader";
import FloatingContainer from "../../../components/FloatingContainer";
import useCustomizeCache from "../../../hooks/useCustomizeCache";

const PlayerEmail: FunctionComponent = () => {
  const navigate = useNavigate();
  const { userHeadshot: userHeadshotCached } = useCustomizeCache();
  const { user } = useAuth();
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

  const handleNext = useCallback(
    (user: FrontendUser, verbose: boolean = true) => {
      if (verbose) {
        message.success(`Welcome ${user?.username || "Player"}!`);
      }

      const nextState: CustomizeNavState_UserHeadshot = {
        name: parsedState.name,
        coverImage: parsedState.coverImage,
        themeColor: parsedState.themeColor,
        inviteLinkMetadata: parsedState.inviteLinkMetadata,
        ticketValue: parsedState.ticketValue,
      };
      navigate(RoutesFE.CustomizePlayerHeadshot, {
        state: nextState,
        replace: true, // If they go back, it will skip this
      });
      return;
    },
    [
      navigate,
      parsedState.coverImage,
      parsedState.inviteLinkMetadata,
      parsedState.name,
      parsedState.themeColor,
      parsedState.ticketValue,
    ]
  );

  // useEffect(() => {
  //   if (user) {
  //     handleNext(user, false);
  //     return;
  //   }
  // }, [user, handleNext]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader />
      {parsedState?.inviteLinkMetadata && (
        <EventHeader eventTitle={parsedState.inviteLinkMetadata.event.title} />
      )}
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
          playerHeadshot={userHeadshotCached}
        />
      </div>
      <div className={styles.scrollSpace} />
      <FloatingContainer title="Enter your Email" handleBack={handleBack}>
        <PlayerEmailForm onNext={handleNext} />
      </FloatingContainer>
    </div>
  );
};

export default PlayerEmail;
