import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_ThemeColor,
  CustomizeNavState_TicketValue,
  CustomizeNavState_UserEmail,
  CustomizeNavState_UserHeadshot,
  RoutesFE,
} from "../../../routes.types";
import { LootboxThemeColorForm } from "../../../components/LootboxForm";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import { Button, Typography } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import useCustomizeCache from "../../../hooks/useCustomizeCache";
import { useEventProvider } from "../../../hooks/useEvent/EventProvider";
import EventHeader from "../../../components/Header/EventHeader";
import { EventInviteType } from "@wormgraph/helpers";
import WhoAmI from "../../../components/WhoAmI";
import { useAuth } from "../../../hooks/useAuth";
import FloatingContainer from "../../../components/FloatingContainer";

const LootboxThemeColor: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_ThemeColor | null } =
    useLocation();
  const parsedState: CustomizeNavState_ThemeColor = state || {
    name: "",
    coverImage: "",
  };
  const { user } = useAuth();
  const {
    themeColor: themeColorCached,
    setThemeColor: setThemeColorCached,
    userHeadshot: userHeadshotCached,
  } = useCustomizeCache();

  const [themeColorCopy, setThemeColorCopy] = useState<string>(
    themeColorCached || "#000000"
  );

  useEffect(() => {
    if (!state?.coverImage || !state?.name) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (color: string) => {
    setThemeColorCached(color);
    if (
      parsedState?.inviteLinkMetadata?.inviteType === EventInviteType.PLAYER
    ) {
      if (user) {
        // skip email and send to userheadshot
        const nextState: CustomizeNavState_UserHeadshot = {
          name: parsedState.name,
          coverImage: parsedState.coverImage,
          themeColor: color,
          inviteLinkMetadata: parsedState.inviteLinkMetadata,
        };
        navigate(RoutesFE.CustomizePlayerHeadshot, {
          state: nextState,
          replace: true, // If they go back, it will skip this
        });
      } else {
        // Player lootboxes get a predefined ticket value from the event, so we send them to the next page after
        const nextState: CustomizeNavState_UserEmail = {
          name: parsedState.name,
          coverImage: parsedState.coverImage,
          themeColor: color,
          inviteLinkMetadata: parsedState.inviteLinkMetadata,
        };
        navigate(RoutesFE.CustomizePlayerEmail, {
          state: nextState,
        });
      }
    } else {
      // Promoters & non event affiliated users can set their ticket value here
      const nextState: CustomizeNavState_TicketValue = {
        name: parsedState.name,
        coverImage: parsedState.coverImage,
        themeColor: color,
        inviteLinkMetadata: parsedState.inviteLinkMetadata,
      };
      navigate(RoutesFE.CustomizeTicketValue, {
        state: nextState,
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (color: string) => {
    setThemeColorCopy(color);
  };

  const handleChangeComplete = (color: string) => {
    handleChange(color);
    setThemeColorCached(color); // For page refreshes etc
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
          themeColor={themeColorCopy}
          playerHeadshot={userHeadshotCached}
        />
      </div>
      <div className={styles.scrollSpace} />
      <FloatingContainer title="Change Theme Color" handleBack={handleBack}>
        <LootboxThemeColorForm
          initialValue={themeColorCached}
          onNext={handleNext}
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
        />
        {user && <WhoAmI />}
      </FloatingContainer>
    </div>
  );
};

export default LootboxThemeColor;
