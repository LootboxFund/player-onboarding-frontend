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

const TicketValuePage: FunctionComponent = () => {
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
      ticketValue: value?.length > 0 ? value : "My Personal Ticket",
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
          <Typography.Title level={4} style={{ width: "100%" }}>
            <Button
              type="text"
              size="large"
              block
              icon={<LeftCircleOutlined />}
              onClick={handleBack}
            />
            &nbsp; Enter a Ticket Value
          </Typography.Title>
          <TicketValueForm onNext={handleNext} />
          {user && <WhoAmI />}
        </div>
      </div>
    </div>
  );
};

export default TicketValuePage;
