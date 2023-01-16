import { FunctionComponent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../../components/Header/SuppressedHeader";
import rootStyles from "../../../index.module.css";
import styles from "../shared.module.css";
import {
  CustomizeNavState_CreateLootbox,
  RoutesFE,
  ShareLootboxNavState,
} from "../../../routes.types";
import { Button, notification, Result, Spin, Typography } from "antd";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import useEventCreate from "../../../hooks/useEvent";
// import { useAuth } from "../../../hooks/useAuth";
import { LootboxFE } from "../../../lib/types";
import { LeftCircleOutlined } from "@ant-design/icons";

const PlayerSelfie: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_CreateLootbox | null } =
    useLocation();
  const { createEvent } = useEventCreate();
  const parsedState = state || {
    name: "",
    coverImage: "",
    themeColor: "",
  };

  useEffect(() => {
    if (!state?.coverImage || !state?.name || !state?.themeColor) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const buildNextState = (lootbox: LootboxFE): ShareLootboxNavState => {
    return {
      lootbox,
      userMetadata: {
        headshot: state?.userHeadshot,
      },
    };
  };

  const buildCustomizeNavState = (): CustomizeNavState_CreateLootbox => {
    return {
      name: parsedState.name,
      coverImage: parsedState.coverImage,
      themeColor: parsedState.themeColor,
      userHeadshot: parsedState.userHeadshot,
    };
  };

  /**
   * Creates the lootbox with all state data
   * If the user does not have an event, it will create one
   * @param headshot
   */
  const createLootbox = async () => {
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
        const finalNavState = buildCustomizeNavState();

        const result = await createEvent({
          lootboxPayload: finalNavState,
        });

        notification.success({
          message: "Successfully created Lootbox!",
        });

        const nextState = buildNextState(result.lootbox);
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
          playerHeadshot={parsedState.userHeadshot}
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
              &nbsp; Is it POG?
            </Typography.Title>
            <br />
            <Button type="primary" size="large" block onClick={createLootbox}>
              It's POG, Create Lootbox!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSelfie;