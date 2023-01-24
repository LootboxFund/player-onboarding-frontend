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
import { EventFE } from "../../../hooks/useEvent/api.gql";
import useLootbox from "../../../hooks/useLootbox";
import { EventInviteType } from "../../../hooks/useEvent/EventProvider";

const PlayerSelfie: FunctionComponent = () => {
  const { createLootbox, loading: loadingLootbox } = useLootbox();
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

  const buildNextState = (
    lootbox: LootboxFE,
    referral?: ReferralFE,
    event?: EventFE
  ): ShareLootboxNavState => {
    return {
      lootbox,
      event: event,
      userMetadata: {
        headshot: state?.userHeadshot,
      },
      referral: referral
        ? {
            id: referral.id,
            slug: referral.slug,
            inviteImage: referral.inviteImage,
          }
        : undefined,
    };
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
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Something went wrong. Please try again later.",
      });
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
            subTitle="Please wait while we create your lootbox"
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
            <Button type="text" size="large" block onClick={handleBack}>
              Go back & edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSelfie;
