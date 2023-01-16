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
} from "../../api/graphql/generated/types";
import { useMutation } from "@apollo/client";
import { EventFE, LootboxFE, ReferralFE } from "../../lib/types";
import { CustomizeNavState_CreateLootbox } from "../../routes.types";
import useLootbox from "../../hooks/useLootbox";

export interface CreateEventPayload {
  lootboxPayload: CustomizeNavState_CreateLootbox;
  lootboxMaxTickets?: number;
  nftBountyValue?: string;
  title?: string;
}

export interface CreateEventResponseSuccessFE {
  event: EventFE;
  referral: ReferralFE;
  lootbox: LootboxFE;
}

const useEvent = () => {
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
    let createdEvent: EventFE;
    let createdReferral: ReferralFE;

    const eventResponse = await createEventMutation({
      variables: {
        payload: {
          title: payload.title,
        },
      },
    });

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
    });

    const referralResponse = await createReferralMutation({
      variables: {
        payload: {
          type: ReferralType.Genesis,
          tournamentId: createdEvent.id,
          lootboxID: createdLootbox.id,
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