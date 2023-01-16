import { FunctionComponent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_CreateLootbox,
  CustomizeNavState_UserHeadshot,
  RoutesFE,
} from "../../../routes.types";
import UserHeadshotForm from "../../../components/LootboxForm/components/UserHeadshot";
import { Button, PopconfirmProps, Result, Spin, Typography } from "antd";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import { LeftCircleOutlined } from "@ant-design/icons";

const popconfirmBaseProps: PopconfirmProps = {
  title: "Finished your Lootbox Customization?",
  okText: "Yes",
  overlayInnerStyle: {
    backgroundColor: "#151515",
  },
};

const PlayerSelfie: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
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

  const buildCustomizeNavState = (
    headshot?: string
  ): CustomizeNavState_CreateLootbox => {
    return {
      name: parsedState.name,
      coverImage: parsedState.coverImage,
      themeColor: parsedState.themeColor,
      userHeadshot: headshot,
      /** @TODO  define this! */
      // userSocials: undefined,
    };
  };

  /**
   * Creates the lootbox with all state data
   * If the user does not have an event, it will create one
   * @param headshot
   */
  const handleNext = async (headshot?: string) => {
    if (loading) {
      return;
    }

    console.log("headshot", headshot);

    // setLoading(true);

    // notification.info({
    //   key: "loading-create-lootbox",
    //   icon: <Spin />,
    //   message: "Creating Lootbox",
    //   description: "Please wait while we create your lootbox",
    //   duration: 0,
    // });

    // Todo: Upload headshot to user profile
    //

    // Make a new event
    const finalNavState = buildCustomizeNavState(headshot);
    navigate(RoutesFE.CustomizeFinish, { state: finalNavState });
  };

  const handleSkip = () => {
    return handleNext();
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
        {loading ? (
          <Result icon={<Spin />} title="Loading..." />
        ) : (
          <div className={styles.floatingButtonContainerContent}>
            <Typography.Title level={4} style={{ width: "100%" }}>
              <Button
                type="text"
                size="large"
                icon={<LeftCircleOutlined />}
                onClick={handleBack}
              />
              &nbsp; Upload Selfie (Optional)
            </Typography.Title>
            <br />
            <UserHeadshotForm
              onNext={handleNext}
              onChange={setHeadshotCopy}
              popConfirmProps={popconfirmBaseProps}
            />
            <br />
            <Button block size="large" type="default" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSelfie;
