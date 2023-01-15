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

const LootboxName: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_Name | null } = useLocation();
  const parsedState: CustomizeNavState_Name = state || {
    coverImage: "",
  };
  const [nameCopy, setNameCopy] = useState<string>("");

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
    };
    navigate(RoutesFE.CustomizeThemeColor, {
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
        }}
      >
        <SimpleTicket
          coverPhoto={parsedState.coverImage}
          sponsorLogos={[]}
          teamName={nameCopy}
          themeColor={"#000000"}
          playerHeadshot={undefined}
        />
      </div>
      <div className={styles.scrollSpace} />
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <LootboxNameForm
            onBack={handleBack}
            onNext={handleNext}
            onChange={setNameCopy}
          />
        </div>
      </div>
    </div>
  );
};

export default LootboxName;
