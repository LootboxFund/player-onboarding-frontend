import { FunctionComponent, useEffect, useState } from "react";
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

const LootboxThemeColor: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_ThemeColor | null } =
    useLocation();
  const parsedState: CustomizeNavState_ThemeColor = state || {
    name: "",
    coverImage: "",
  };

  const [themeColorCopy, setThemeColorCopy] = useState<string>();

  useEffect(() => {
    if (!state?.coverImage || !state?.name) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleNext = (color: string) => {
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
          themeColor={themeColorCopy || "#000000"}
          playerHeadshot={undefined}
        />

        {/* <MockTicketPreview
          name={state.name}
          coverImage={state.coverImage}
          themeColor={themeColorCopy || "#000000"}
        /> */}
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
            // onBack={handleBack}
            onNext={handleNext}
            onChange={setThemeColorCopy}
          />
        </div>
      </div>
    </div>
  );
};

export default LootboxThemeColor;
