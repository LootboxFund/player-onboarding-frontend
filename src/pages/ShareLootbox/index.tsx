import { FunctionComponent, useEffect, useMemo, useRef } from "react";
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

const ShareLootbox: FunctionComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state }: { state: ShareLootboxNavState | null; search: string } =
    useLocation();
  const carouselRef = useRef<CarouselRef>(null);

  useEffect(() => {
    if (!state?.lootbox || !state?.userMetadata || !state?.referral) {
      console.log("no data");
      notification.error({ message: "An error occured. Please try again." });
      navigate(-1);
    }
  });

  useEffect(() => {
    if (!state?.lootbox || !state?.userMetadata || !state?.referral) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const inviteLink = useMemo(() => {
    return `${manifest.microfrontends.webflow.referral}?r=${state?.referral?.slug}`;
  }, [state?.referral.slug]);

  const parsedState: ShareLootboxNavState = state || {
    lootbox: {
      id: "" as LootboxID,
      name: "",
      stampImage: "",
      backgroundImage: "",
      themeColor: "#000000",
    },
    userMetadata: {
      headshot: "",
    },
    referral: {
      id: "" as ReferralID,
      slug: "" as ReferralSlug,
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
          {state?.referral?.inviteImage && (
            <div key="invite-stamp" className={styles.ticketContainer}>
              <img
                src={state.referral.inviteImage}
                alt="Your Invite Graphic"
                className={styles.ticket}
                style={{
                  filter: "drop-shadow(#ffffffaa 0px 0px 10px)",
                }}
              />
              <br />
              <a
                style={{ textDecoration: "none" }}
                href={state.referral.inviteImage}
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
