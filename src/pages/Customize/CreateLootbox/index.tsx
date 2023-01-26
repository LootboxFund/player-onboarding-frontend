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
import { Button, message, notification, Result, Spin, Typography } from "antd";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import useEventCreate, { CreateEventPayload } from "../../../hooks/useEvent";
import { LootboxFE, ReferralFE } from "../../../lib/types";
import { LeftCircleOutlined } from "@ant-design/icons";
import EventHeader from "../../../components/Header/EventHeader";
import useLootbox from "../../../hooks/useLootbox";
import { manifest } from "../../../manifest";
import { EventInviteType } from "@wormgraph/helpers";
import WhoAmI from "../../../components/WhoAmI";
import { useAuth } from "../../../hooks/useAuth";

const ALREADY_CREATED_NOTIF_KEY = "already-created-notif";

const PlayerSelfie: FunctionComponent = () => {
  const { createLootbox } = useLootbox();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_CreateLootbox | null } =
    useLocation();
  const { createEvent } = useEventCreate();
  let parsedState = state || {
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

  const buildNextState = (
    lootbox: LootboxFE,
    referral?: ReferralFE
  ): ShareLootboxNavState => {
    return {
      lootbox,
      userMetadata: {
        headshot: state?.userHeadshot,
      },
      inviteLinkMetadata: state?.inviteLinkMetadata,
      referral: referral
        ? {
            inviteGraphic: referral.inviteImage || "",
            inviteLink: `${manifest.microfrontends.webflow.referral}?r=${referral.slug}`,
          }
        : undefined,
    };
  };

  const createLootboxWithoutEvent = async () => {
    notification.destroy(ALREADY_CREATED_NOTIF_KEY);
    parsedState.inviteLinkMetadata = undefined;
    return handleLootboxCreate();
  };

  /**
   * Creates the lootbox with all state data
   * If the user does not have an event, it will create one
   * @param headshot
   */
  const handleLootboxCreate = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (parsedState.inviteLinkMetadata) {
        const { lootbox: createdLootbox } = await createLootbox({
          tournamentID: parsedState.inviteLinkMetadata.event.id,
          backgroundImage: parsedState.coverImage,
          isExclusiveLootbox: true,
          // TODO use socials for this?
          // joinCommunityUrl: payload.lootboxPayload.userSocials
          name: parsedState.name,
          themeColor: parsedState.themeColor,
          headshot: parsedState.userHeadshot,
          maxTickets:
            parsedState.inviteLinkMetadata.inviteType ===
            EventInviteType.PROMOTER
              ? 10000
              : undefined,
          isPromoterLootbox:
            parsedState.inviteLinkMetadata.inviteType ===
            EventInviteType.PROMOTER,
          ticketValue: parsedState.ticketValue,
        });

        const nextState = buildNextState(createdLootbox);
        navigate(RoutesFE.ShareLootbox, { state: nextState });
      } else {
        // User not affiliated to an event, so we make an event & then make the lootbox
        const payload: CreateEventPayload = {
          lootboxPayload: {
            name: parsedState.name,
            coverImage: parsedState.coverImage,
            themeColor: parsedState.themeColor,
            ticketValue: parsedState.ticketValue,
          },
          stampMetadata: {
            headshot: parsedState.userHeadshot,
          },
        };

        const result = await createEvent(payload);

        const nextState = buildNextState(result.lootbox, result.referral);
        navigate(RoutesFE.ShareLootbox, { state: nextState });
      }
      message.success(`${parsedState.name} Created!`);
      // clear the event invite metadata
    } catch (err: any) {
      console.error(err);
      notification.error({
        message:
          err?.message || "Something went wrong. Please try again later.",
      });
      if (err?.message?.toLowerCase().includes("already created")) {
        notification.info({
          key: ALREADY_CREATED_NOTIF_KEY,
          message: "Would you like to make this Lootbox without the event?",
          description: (
            <Button
              onClick={createLootboxWithoutEvent}
              disabled={loading}
              loading={loading}
              type="link"
              style={{
                padding: 0,
              }}
            >
              Create Lootbox without Event
            </Button>
          ),
          duration: 0,
        });
      }
      return;
    } finally {
      setLoading(false);
      return;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader />
      {parsedState?.inviteLinkMetadata?.event && (
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
          playerHeadshot={parsedState.userHeadshot}
        />
      </div>
      <div style={{ height: "200px" }} />
      <div className={styles.floatingButtonContainer}>
        {loading ? (
          <Result
            icon={<Spin />}
            subTitle="Please wait while we create your Lootbox"
            style={{ padding: "16px" }}
          />
        ) : (
          <div className={styles.floatingButtonContainerContent}>
            <Typography.Title level={4} style={{ width: "100%" }}>
              <Button
                type="text"
                size="large"
                icon={<LeftCircleOutlined />}
                onClick={handleBack}
              />
              &nbsp; Confirm your Design
            </Typography.Title>
            <br />
            <Button
              type="primary"
              size="large"
              block
              onClick={handleLootboxCreate}
              style={{
                boxShadow: "#ffffffaa 0px 0px 10px",
              }}
            >
              Create Lootbox
            </Button>
            <br />
            <Button type="text" size="small" block onClick={handleBack}>
              Go back & edit
            </Button>
            {user && <WhoAmI />}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSelfie;
