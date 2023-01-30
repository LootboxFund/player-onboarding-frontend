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
import { Button, PopconfirmProps } from "antd";
import SimpleTicket from "../../../components/TicketDesigns/SimpleTicket";
import useCustomizeCache from "../../../hooks/useCustomizeCache";
import EventHeader from "../../../components/Header/EventHeader";
import WhoAmI from "../../../components/WhoAmI";
import { useAuth } from "../../../hooks/useAuth";
import FloatingContainer from "../../../components/FloatingContainer";
import { useMutation } from "@apollo/client";
import {
  MutationUpdateUserArgs,
  ResponseError,
} from "../../../api/graphql/generated/types";
import { UpdateUserResponseFE, UPDATE_USER } from "./api.gql";
import { GET_MY_PROFILE } from "../../../hooks/useAuth/api.gql";

const popconfirmBaseProps: PopconfirmProps = {
  title: "Finished your Lootbox Customization?",
  okText: "Yes",
  overlayInnerStyle: {
    backgroundColor: "#151515",
  },
};

const PlayerSelfie: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const { user, userDB } = useAuth();
  const navigate = useNavigate();
  const { state }: { state: CustomizeNavState_UserHeadshot | null } =
    useLocation();
  const parsedState = state || {
    name: "",
    coverImage: "",
    themeColor: "",
  };
  const { userHeadshot: headshotCached, setUserHeadshot: setHeadshotCached } =
    useCustomizeCache();

  const [headshotCopy, setHeadshotCopy] = useState<string | undefined>(
    headshotCached
  );

  const [updateUser, { loading: loadingUpdateUser }] = useMutation<
    { updateUser: ResponseError | UpdateUserResponseFE },
    MutationUpdateUserArgs
  >(UPDATE_USER, {
    refetchQueries: [{ query: GET_MY_PROFILE }],
  });

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
      inviteLinkMetadata: parsedState.inviteLinkMetadata,
      ticketValue: parsedState.ticketValue,
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

    setHeadshotCached(headshot);

    // Upload headshot to user profile
    if (headshot && userDB?.headshot?.indexOf(headshot) === -1) {
      updateUser({
        variables: {
          payload: {
            headshot: headshot,
          },
        },
      });
    }

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
      {parsedState?.inviteLinkMetadata && (
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
          playerHeadshot={headshotCopy}
        />
      </div>
      <div className={styles.scrollSpace} />
      <FloatingContainer
        loading={loading}
        title="Upload Selfie (Optional)"
        handleBack={handleBack}
      >
        <UserHeadshotForm
          initialHeadshot={headshotCached}
          onNext={handleNext}
          onChange={setHeadshotCopy}
          popConfirmProps={popconfirmBaseProps}
        />
        <br />
        <Button type="text" block size="small" onClick={handleSkip}>
          Skip
        </Button>
        {user && <WhoAmI />}
      </FloatingContainer>
    </div>
  );
};

export default PlayerSelfie;
