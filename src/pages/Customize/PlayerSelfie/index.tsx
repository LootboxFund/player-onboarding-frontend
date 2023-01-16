import { FunctionComponent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState,
  CustomizeNavState_UserHeadshot,
  RoutesFE,
  ShareLootboxNavState,
} from "../../../routes.types";
import UserHeadshotForm from "../../../components/LootboxForm/components/UserHeadshot";
import {
  Button,
  notification,
  Popconfirm,
  PopconfirmProps,
  Result,
  Spin,
} from "antd";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import useEventCreate from "../../../hooks/useEvent";
// import { useAuth } from "../../../hooks/useAuth";
import { LootboxFE } from "../../../lib/types";

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
  const { createEvent } = useEventCreate();
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

  const buildNextState = (
    lootbox: LootboxFE,
    headshot?: string
  ): ShareLootboxNavState => {
    return {
      lootbox,
      userMetadata: {
        headshot,
      },
    };
  };

  const buildCustomizeNavState = (headshot?: string): CustomizeNavState => {
    return {
      name: parsedState.name,
      coverImage: parsedState.coverImage,
      themeColor: parsedState.themeColor,
      userHeadshot: headshot,
      // TODO: define this!
      userSocials: undefined,
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

    setLoading(true);

    // TODO: Implement this
    const isLootboxAffiliatedToEvent = false;

    notification.info({
      key: "loading-create-lootbox",
      icon: <Spin />,
      message: "Creating Lootbox",
      description: "Please wait while we create your lootbox",
      duration: 0,
    });

    try {
      if (isLootboxAffiliatedToEvent) {
        console.error("Lootbox event affiliation is not implemented yet");
        throw new Error("Not implemented");
      } else {
        // Make a new event
        const finalNavState = buildCustomizeNavState(headshot);

        const result = await createEvent({
          lootboxPayload: finalNavState,
        });

        notification.success({
          message: "Successfully created Lootbox!",
        });

        const nextState = buildNextState(result.lootbox, headshot);
        navigate(RoutesFE.ShareLootbox, { state: nextState });
        return;
      }
    } catch (err) {
      console.error(err);
      // message.error("Something went wrong. Please try again later.");
      notification.error({
        message: "Something went wrong. Please try again later.",
      });
      return;
    } finally {
      setLoading(false);
      notification.destroy("loading-create-lootbox");
    }
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
        {loading ? (
          <Result icon={<Spin />} title="Loading..." />
        ) : (
          <div className={styles.floatingButtonContainerContent}>
            <UserHeadshotForm
              onBack={handleBack}
              onNext={handleNext}
              onChange={setHeadshotCopy}
              popConfirmProps={popconfirmBaseProps}
            />
            <br />
            <Popconfirm {...popconfirmBaseProps} onConfirm={handleSkip}>
              <Button size="large" type="default" style={{ width: "100%" }}>
                Skip
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSelfie;
