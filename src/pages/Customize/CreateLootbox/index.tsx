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
import { Button, message, notification } from "antd";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import useEventCreate, { CreateEventPayload } from "../../../hooks/useEvent";
import { LootboxFE, ReferralFE } from "../../../lib/types";
import EventHeader from "../../../components/Header/EventHeader";
import useLootbox from "../../../hooks/useLootbox";
import { manifest } from "../../../manifest";
import { EventInviteType, LootboxType } from "@wormgraph/helpers";
import WhoAmI from "../../../components/WhoAmI";
import { useAuth } from "../../../hooks/useAuth";
import FloatingContainer from "../../../components/FloatingContainer";
import selectStyles from "./index.module.css";

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
          type:
            parsedState.inviteLinkMetadata.inviteType ===
            EventInviteType.PROMOTER
              ? LootboxType.Promoter
              : LootboxType.Player,
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
      <FloatingContainer
        title="Confirm your Design"
        handleBack={handleBack}
        loading={loading}
        loadingMessage="Please wait while we create your Lootbox"
      >
        <Button
          type="primary"
          size="large"
          block
          onClick={handleLootboxCreate}
          className={selectStyles.coolBtn}
        >
          Create Lootbox
        </Button>
        <br />
        <Button type="text" size="small" block onClick={handleBack}>
          Go back & edit
        </Button>
        {user && <WhoAmI />}
      </FloatingContainer>
    </div>
  );
};

export default PlayerSelfie;
