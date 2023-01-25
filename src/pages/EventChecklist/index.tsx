import { useLocation } from "react-router-dom";
import { Button, Result, Typography } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { EventInviteType } from "@wormgraph/helpers";
import rootStyles from "../../index.module.css";
import styles from "./index.module.css";
import { EventChecklistNavState } from "../../routes.types";
import { manifest } from "../../manifest";

const EventChecklistPage = () => {
  const { user } = useAuth();
  const { state }: { state: EventChecklistNavState | null } = useLocation();

  const urlToNavTo =
    state?.inviteLinkMetadata?.inviteType === EventInviteType.PROMOTER &&
    state?.inviteLinkMetadata?.event?.inviteMetadata?.promoterDestinationURL
      ? state?.inviteLinkMetadata?.event?.inviteMetadata?.promoterDestinationURL
      : state?.inviteLinkMetadata?.event?.inviteMetadata?.playerDestinationURL;
  const profileURL = `${manifest.microfrontends.webflow.publicProfile}?uid=${user?.id}`;

  return (
    <div
      className={rootStyles.responsivePageContainer}
      style={{
        padding: "var(--padding-md) var(--padding-sm)",
        boxSizing: "border-box",
      }}
    >
      <Typography.Title level={4}>
        The event organizer wants to redirect you to another website to finish
        registration.
      </Typography.Title>
      <br />
      <br />
      <div className={styles.contentContainer}>
        <Typography.Title level={4} style={{ color: "#474747" }}>
          Proceed to site?
        </Typography.Title>
        <br />
        <Typography.Text
          style={{ color: "#474747", fontSize: "1rem", fontWeight: 800 }}
          copyable
        >
          {urlToNavTo}
        </Typography.Text>
        <br />
      </div>
      <br />
      <a
        href={urlToNavTo ?? ""}
        style={{ textDecoration: "underlined" }}
        target="_blank"
        rel="noreferrer"
      >
        <Button type="primary" size="large" block>
          Proceed
        </Button>
      </a>
      <br />
      <br />
      <a
        href={profileURL}
        style={{ textDecoration: "underlined" }}
        target="_blank"
        rel="noreferrer"
      >
        <Button block type="text" size="large">
          Skip to Profile
        </Button>
      </a>
    </div>
  );
};

export default EventChecklistPage;
