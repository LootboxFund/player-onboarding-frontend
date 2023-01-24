import { FunctionComponent, useEffect, useState } from "react";
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
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import { Button, Typography } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import useCustomizeCache from "../../../hooks/useCustomizeCache";
import EventHeader from "../../../components/Header/EventHeader";

const LootboxName: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_Name | null } = useLocation();
  const parsedState: CustomizeNavState_Name = state || {
    coverImage: "",
  };
  const {
    userHeadshot: userHeadshotCached,
    name: nameCached,
    setName: setNameCached,
    themeColor: themeColorCached,
  } = useCustomizeCache();
  const [nameCopy, setNameCopy] = useState<string>(nameCached ?? "");

  useEffect(() => {
    if (!state?.coverImage) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (name: string) => {
    const nextState: CustomizeNavState_ThemeColor = {
      name,
      coverImage: parsedState.coverImage,
      inviteLinkMetadata: parsedState.inviteLinkMetadata,
    };
    navigate(RoutesFE.CustomizeThemeColor, {
      state: nextState,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (name: string) => {
    setNameCopy(name);
    setNameCached(name);
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
          teamName={nameCopy || "Player"}
          themeColor={themeColorCached ?? "#000000"}
          playerHeadshot={userHeadshotCached}
        />
      </div>
      <div className={styles.scrollSpace} />
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <Typography.Title level={4} style={{ width: "100%" }}>
            <Button
              type="text"
              size="large"
              icon={<LeftCircleOutlined />}
              onClick={handleBack}
            />
            &nbsp; Name your Lootbox
          </Typography.Title>
          <br />
          <LootboxNameForm
            initialValue={nameCached}
            onNext={handleNext}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LootboxName;
