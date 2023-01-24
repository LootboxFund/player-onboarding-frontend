import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareHeader from "../../components/Header/ShareHeader";
import rootStyles from "../../index.module.css";
import styles from "./index.module.css";
import { RoutesFE, ShareLootboxNavState } from "../../routes.types";
import { LootboxID, ReferralID, ReferralSlug } from "@wormgraph/helpers";
import { Button, Carousel, message, notification, Typography } from "antd";
import { manifest } from "../../manifest";
import { useAuth } from "../../hooks/useAuth";
import { CarouselRef } from "antd/es/carousel";
import { useQuery } from "@apollo/client";
import { GetLootboxResponseFE, GET_LOOTBOX } from "./api.gql";
import { QueryGetLootboxByIdArgs } from "../../api/graphql/generated/types";
import { ReferralSnippetFE } from "../../lib/types";

const ShareLootbox: FunctionComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state }: { state: ShareLootboxNavState | null; search: string } =
    useLocation();
  const carouselRef = useRef<CarouselRef>(null);
  const hasRunInit = useRef(false);
  const [referralInfoFE, setReferralInfoFE] = useState<ReferralSnippetFE>();
  const { data, startPolling, stopPolling } = useQuery<
    GetLootboxResponseFE,
    QueryGetLootboxByIdArgs
  >(GET_LOOTBOX, {
    onCompleted: (data: GetLootboxResponseFE) => {
      if (
        data?.getLootboxByID?.__typename === "GetLootboxByIdResponseSuccess"
      ) {
        if (
          data.getLootboxByID.lootbox.officialInviteGraphic &&
          data.getLootboxByID.lootbox.officialInviteLink
        ) {
          // End condition - stop polling!
          hasRunInit.current = true;
          stopPolling();
          console.log(
            "stop polling - end condition",
            data.getLootboxByID.lootbox
          );
        }
      }
    },
  });

  useEffect(() => {
    if (!state?.lootbox || !state?.userMetadata) {
      console.log("no data, redirecting to home");
      notification.error({ message: "An error occured. Please try again." });
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  // useEffect(() => {
  //   // If event was created less than 5 minutes ago, start polling for lootboxes
  //   if (
  //     !isPolling &&
  //     event?.createdAt &&
  //     Date.now() - state.lootbox.timestamps.createdAt < 5 * 60 * 1000 // event made within last 5 mins
  //   ) {
  //     setIsPolling(true);
  //     // Poll every 5 seconds
  //     console.log("start polling...");
  //     startPolling(2500);
  //     hasPolledOnce.current = true;
  //     const timeout = setTimeout(() => {
  //       console.log("stop polling - timeout");
  //       stopPolling();
  //       setIsPolling(false);
  //       // Stop polling after 1 minute
  //     }, 1 * 60 * 1000);

  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, [state, startPolling, stopPolling, isPolling]);

  const inviteLink = useMemo(() => {
    return state?.referral?.inviteLink || "";
  }, [state?.referral?.inviteLink]);

  const parsedState: ShareLootboxNavState = state || {
    lootbox: {
      id: "" as LootboxID,
      name: "",
      stampImage: "",
      backgroundImage: "",
      themeColor: "#000000",
      timestamps: {
        createdAt: 0,
      },
    },
    userMetadata: {
      headshot: "",
    },
    referral: {
      inviteGraphic: "",
      inviteLink: "",
    },
  };
  const inviteLinkShort = inviteLink.replace("https://", "");
  const gamerProfilePage = `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      message.success("Copied your invite link!");
    } catch (err) {
      message.error("An error occured");
    }
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <ShareHeader themeColor={parsedState.lootbox.themeColor} />

      <div
        className={styles.customizeMainContainer}
        style={{
          backgroundImage: `url(${parsedState.lootbox.backgroundImage})`,
          backgroundBlendMode: "multiply", // darken it
        }}
      >
        <Carousel
          ref={carouselRef}
          dots={false}
          style={{
            width: "100vw",
            maxWidth: "600px",
          }}
        >
          {state?.referral?.inviteGraphic && (
            <div key="invite-stamp" className={styles.ticketContainer}>
              <img
                src={state.referral.inviteGraphic}
                alt="Your Invite Graphic"
                className={styles.ticket}
                style={{
                  filter: "drop-shadow(#ffffffaa 0px 0px 10px)",
                }}
              />
              <br />
              <a
                style={{ textDecoration: "none" }}
                href={state.referral.inviteLink}
                download
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  style={{
                    boxShadow: "#ffffffaa 0px 0px 10px",
                  }}
                >
                  Download & Share
                </Button>
              </a>
            </div>
          )}
          {state?.lootbox?.stampImage && (
            <div key="preview-simple-stamp" className={styles.ticketContainer}>
              <img
                src={state.lootbox.stampImage}
                alt="Your Lootbox"
                className={styles.ticket}
                style={{
                  filter: "drop-shadow(#ffffffaa 0px 0px 10px)",
                }}
              />
              <br />
              <a
                style={{ textDecoration: "none" }}
                href={state.lootbox.stampImage}
                download
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  style={{
                    boxShadow: "#ffffffaa 0px 0px 10px",
                  }}
                >
                  Download & Share
                </Button>
              </a>
            </div>
          )}
        </Carousel>
      </div>
      <div className={styles.scrollSpace} />
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <div className={styles.frameDiv4}>
            <Typography.Text className={styles.scanForFanTickets}>
              🔒 {inviteLinkShort}
            </Typography.Text>
          </div>
          <br />
          <Button
            type="primary"
            block
            onClick={copyInviteLink}
            size="large"
            style={{
              backgroundColor: parsedState.lootbox.themeColor,
            }}
          >
            Copy Invite
          </Button>
          <br />
          <a
            href={gamerProfilePage}
            style={{ textDecoration: "none" }}
            target="_blank"
            rel="noreferrer"
          >
            <Button block type="text">
              Skip to Profile
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareLootbox;
