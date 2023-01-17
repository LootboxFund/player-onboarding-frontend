import { FunctionComponent, useEffect, useRef, useState } from "react";
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
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import { Button, Typography } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import useCustomizeCache from "../../../hooks/useCustomizeCache";

const LootboxThemeColor: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_ThemeColor | null } =
    useLocation();
  const parsedState: CustomizeNavState_ThemeColor = state || {
    name: "",
    coverImage: "",
  };
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
    console.log("next", color);
    setThemeColorCached(color);
    const nextState: CustomizeNavState_UserEmail = {
      name: parsedState.name,
      coverImage: parsedState.coverImage,
      themeColor: color,
    };
    navigate(RoutesFE.CustomizePlayerEmail, {
      state: nextState,
    });
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
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <Typography.Title level={4} style={{ width: "100%" }}>
            <Button
              type="text"
              size="large"
              icon={<LeftCircleOutlined />}
              onClick={handleBack}
            />
            &nbsp; Change Theme Color
          </Typography.Title>
          <br />
          <LootboxThemeColorForm
            initialValue={themeColorCached}
            onNext={handleNext}
            onChange={handleChange}
            onChangeComplete={handleChangeComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default LootboxThemeColor;
