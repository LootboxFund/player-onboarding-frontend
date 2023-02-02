import {
  CreateEventResponseFE,
  CreateReferralResponseFE,
  CREATE_EVENT,
  CREATE_REFERRAL,
} from "./api.gql";
import {
  MutationCreateReferralArgs,
  MutationCreateTournamentArgs,
  ReferralType,
  StatusCode,
} from "../../api/graphql/generated/types";
import { useMutation } from "@apollo/client";
import { CreatedEventFE, LootboxFE, ReferralFE } from "../../lib/types";
import useLootbox from "../../hooks/useLootbox";
import { LootboxType } from "@wormgraph/helpers";
import { useAuth } from "../useAuth";

export interface CreateEventPayload {
  lootboxPayload: {
    coverImage: string;
    name: string;
    themeColor: string;
    ticketValue: string | undefined;
  };
  stampMetadata?: {
    headshot?: string;
  };
}

export interface CreateEventResponseSuccessFE {
  event: CreatedEventFE;
  referral: ReferralFE;
  lootbox: LootboxFE;
}

const useEvent = () => {
  const { upgradeUserToAffiliate } = useAuth();
  const { createLootbox, loading: loadingLootbox } = useLootbox();

  const [createEventMutation, { loading: loadingEventCreate }] = useMutation<
    CreateEventResponseFE,
    MutationCreateTournamentArgs
  >(CREATE_EVENT);

  const [createReferralMutation, { loading: loadingReferralCreate }] =
    useMutation<CreateReferralResponseFE, MutationCreateReferralArgs>(
      CREATE_REFERRAL
    );

  /**
   * This thing just calls 3 mutations:
   * - create event
   * - bulk create lootboxes
   * - creates a referral code
   *
   * Throws an error on errors
   */
  const createEvent = async (
    payload: CreateEventPayload
  ): Promise<CreateEventResponseSuccessFE> => {
    let createdEvent: CreatedEventFE;
    let createdReferral: ReferralFE;

    let eventResponse = await createEventMutation({
      variables: {
        payload: {
          title: undefined,
        },
      },
    });

    // Catch errors if no affiliate is found and auto upgrade to affiliate & retry
    if (
      eventResponse?.data?.createTournament?.__typename === "ResponseError" &&
      eventResponse.data.createTournament.error.code ===
        StatusCode.AffiliateNotFound
    ) {
      console.log("caught no-affiliate");
      // auto upgrade to affiliate
      await upgradeUserToAffiliate();
      eventResponse = await createEventMutation({
        variables: {
          payload: {
            title: undefined,
          },
        },
      });
    }

    if (
      eventResponse?.data?.createTournament?.__typename ===
      "CreateTournamentResponseSuccess"
    ) {
      createdEvent = {
        id: eventResponse.data.createTournament.tournament.id,
        title: eventResponse.data.createTournament.tournament.title,
        createdAt:
          eventResponse.data.createTournament.tournament.timestamps.createdAt,
      };
    } else {
      throw new Error("An error occured!");
    }

    const { lootbox: createdLootbox } = await createLootbox({
      tournamentID: createdEvent.id,
      backgroundImage: payload.lootboxPayload.coverImage,
      isExclusiveLootbox: true,
      // TODO use socials for this?
      // joinCommunityUrl: payload.lootboxPayload.userSocials
      name: payload.lootboxPayload.name,
      themeColor: payload.lootboxPayload.themeColor,
      headshot: payload.stampMetadata?.headshot,
      ticketValue: payload.lootboxPayload.ticketValue,
      type: LootboxType.Player,
    });

    const referralResponse = await createReferralMutation({
      variables: {
        payload: {
          type: ReferralType.Genesis,
          tournamentId: createdEvent.id,
          lootboxID: createdLootbox.id,
          inviteStampMetadata: {
            playerHeadshot: payload.stampMetadata?.headshot,
          },
        },
      },
    });

    if (
      !referralResponse?.data?.createReferral ||
      referralResponse.data.createReferral.__typename === "ResponseError"
    ) {
      throw new Error("An error occured!");
    }

    createdReferral = {
      id: referralResponse.data.createReferral.referral.id,
      slug: referralResponse.data.createReferral.referral.slug,
      inviteImage:
        referralResponse.data.createReferral.referral.inviteGraphic ??
        undefined,
    };

    return {
      event: createdEvent,
      referral: createdReferral,
      lootbox: createdLootbox,
    };
  };

  return {
    createEvent,
    loading: loadingEventCreate || loadingReferralCreate || loadingLootbox,
  };
};

export default useEvent;
