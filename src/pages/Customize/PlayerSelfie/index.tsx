import { FunctionComponent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_UserHeadshot,
  RoutesFE,
} from "../../../routes.types";
import UserHeadshotForm from "../../../components/LootboxForm/components/UserHeadshot";
import MockTicketPreview from "../../../components/MockTicketPreview";
import { Button } from "antd";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";

const PlayerSelfie: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_UserHeadshot | null } =
    useLocation();
  const parsedState = state || {
    name: "",
    coverImage: "",
    themeColor: "",
  };
  const [headshotCopy, setHeadshotCopy] = useState<string | undefined>();

  useEffect(() => {
    if (!state?.coverImage || !state?.name || !state?.themeColor) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  // const buildNextState = (headshot?: string): CustomizeNavState_Finalize => {
  //   return {
  //     name: parsedState.name,
  //     coverImage: parsedState.coverImage,
  //     themeColor: parsedState.themeColor,
  //     userHeadshot: headshot,
  //     // TODO: Implement
  //     userSocials: undefined,
  //   };
  // };

  const handleNext = (headshot?: string) => {
    // const nextState = buildNextState(headshot);
    // navigate(RoutesFE.CustomizeFinalization, {
    //   state: nextState,
    // });
  };

  const handleSkip = () => {
    handleNext();
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
        }}
      >
        <SimpleTicket
          coverPhoto={parsedState.coverImage}
          sponsorLogos={[]}
          teamName={parsedState.name}
          themeColor={parsedState.themeColor}
          playerHeadshot={headshotCopy}
        />
      </div>
      <div className={styles.scrollSpace} />
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <UserHeadshotForm
            onBack={handleBack}
            onNext={handleNext}
            onChange={setHeadshotCopy}
          />
          <br />
          <Button
            size="large"
            type="default"
            style={{ width: "100%" }}
            onClick={handleSkip}
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelfie;
