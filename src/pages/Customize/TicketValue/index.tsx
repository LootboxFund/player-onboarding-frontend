import { FunctionComponent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_TicketValue,
  CustomizeNavState_UserHeadshot,
  RoutesFE,
} from "../../../routes.types";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import { Button, Typography } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import EventHeader from "../../../components/Header/EventHeader";
import TicketValueForm from "../../../components/LootboxForm/components/TicketValue";
import WhoAmI from "../../../components/WhoAmI";
import { useAuth } from "../../../hooks/useAuth";
import FloatingContainer from "../../../components/FloatingContainer";
import useCustomizeCache from "../../../hooks/useCustomizeCache";

const TicketValuePage: FunctionComponent = () => {
  const { userHeadshot: userHeadshotCached } = useCustomizeCache();
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_TicketValue | null } =
    useLocation();
  const parsedState: CustomizeNavState_TicketValue = state || {
    name: "",
    coverImage: "",
    themeColor: "",
  };
  const { user } = useAuth();

  useEffect(() => {
    if (!state?.coverImage || !state?.name || !state?.themeColor) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (value: string) => {
    const nextState: CustomizeNavState_UserHeadshot = {
      name: parsedState.name,
      coverImage: parsedState.coverImage,
      themeColor: parsedState.themeColor,
      inviteLinkMetadata: parsedState.inviteLinkMetadata,
      ticketValue: value?.length > 0 ? value : "My Ticket",
    };

    navigate(RoutesFE.CustomizePlayerEmail, {
      state: nextState,
    });
    return;
  };

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
      <FloatingContainer handleBack={handleBack} title={"Enter a Ticket Value"}>
        <TicketValueForm onNext={handleNext} />
        {user && <WhoAmI />}
      </FloatingContainer>
    </div>
  );
};

export default TicketValuePage;
