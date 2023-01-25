import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareHeader from "../../components/Header/ShareHeader";
import rootStyles from "../../index.module.css";
import styles from "./index.module.css";
import { RoutesFE, ShareLootboxNavState } from "../../routes.types";
import { LootboxID } from "@wormgraph/helpers";
import {
  Button,
  Carousel,
  message,
  notification,
  Result,
  Spin,
  Typography,
} from "antd";
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
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!state?.lootbox || !state?.userMetadata) {
      console.log("no data, redirecting to home");
      notification.error({ message: "An error occured. Please try again." });
      navigate(RoutesFE.Home, { replace: true });
    } else if (state.referral) {
      setReferralInfoFE(state.referral);
    }
  }, [state, navigate]);

  const { startPolling, stopPolling } = useQuery<
    GetLootboxResponseFE,
    QueryGetLootboxByIdArgs
  >(GET_LOOTBOX, {
    skip: !!state?.referral,
    variables: {
      id: state?.lootbox?.id || "",
    },
    onCompleted: (data: GetLootboxResponseFE) => {
      if (data?.getLootboxByID?.__typename === "LootboxResponseSuccess") {
        if (
          data.getLootboxByID.lootbox.officialInviteGraphic &&
          data.getLootboxByID.lootbox.officialInviteLink
        ) {
          // End condition - stop polling!
          hasRunInit.current = true;
          stopPolling();
          setIsPolling(false);
          console.log(
            "stop polling - end condition",
            data.getLootboxByID.lootbox
          );
          setReferralInfoFE({
            inviteGraphic: data.getLootboxByID.lootbox.officialInviteGraphic,
            inviteLink: data.getLootboxByID.lootbox.officialInviteLink,
          });
        }
      }
    },
  });

  useEffect(() => {
    // If lootbox was created less than 5 minutes ago, start polling for the async official invite link
    if (
      !isPolling &&
      !hasRunInit.current &&
      state?.lootbox?.timestamps?.createdAt &&
      Date.now() - state.lootbox.timestamps.createdAt < 5 * 60 * 1000 // lootbox made within last 5 mins
    ) {
      setIsPolling(true);
      // Poll every 5 seconds
      console.log("start polling...");
      startPolling(1500);
      const timeout = setTimeout(() => {
        console.log("stop polling - timeout");
        stopPolling();
        setIsPolling(false);
        message.error(
          "We could not find your invite link. Please try again later."
        );
        // Stop polling after 1 minute
      }, 1 * 60 * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [state, startPolling, stopPolling, isPolling]);

  const { inviteLink, inviteLinkShort } = useMemo(() => {
    const inviteLink =
      referralInfoFE?.inviteLink || state?.referral?.inviteLink || "";
    const inviteLinkShort = inviteLink.replace("https://", "");
    return { inviteLink, inviteLinkShort };
  }, [state?.referral?.inviteLink, referralInfoFE]);

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
          {!referralInfoFE && isPolling && (
            <div key="loading-stamp-images" className={styles.loadingContainer}>
              <Result
                icon={<Spin />}
                title="Generating your invite graphic..."
                subTitle="This is a unique URL & graphic that you can share with your friends!"
                style={{
                  background: "rgba(1, 1, 1, 0.65)",
                  borderRadius: "16px",
                  boxShadow: `0px 0px 20px #ffffffAA`,
                }}
              />
            </div>
          )}
          {referralInfoFE && (
            <div key="invite-stamp" className={styles.ticketContainer}>
              <img
                src={referralInfoFE.inviteGraphic}
                alt="Your Invite Graphic"
                className={styles.ticket}
                style={{
                  filter: "drop-shadow(#ffffffaa 0px 0px 10px)",
                }}
              />
              <br />
              <a
                style={{ textDecoration: "none" }}
                href={referralInfoFE.inviteGraphic}
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
            {inviteLinkShort ? (
              <Typography.Text className={styles.scanForFanTickets}>
                🔒 {inviteLinkShort}
              </Typography.Text>
            ) : (
              <div
                className={styles.scanForFanTickets}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </div>
            )}
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
            disabled={!inviteLinkShort || isPolling}
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
