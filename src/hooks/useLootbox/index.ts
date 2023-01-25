import { useMutation } from "@apollo/client";
import { TournamentID } from "@wormgraph/helpers";
import { useState } from "react";
import { CreateLootboxPayload } from "../../api/graphql/generated/types";
import { LootboxFE } from "../../lib/types";
import {
  CreateLootboxResponseFE,
  CreateLootboxResponseSuccessFE,
  CREATE_LOOTBOX,
} from "./api.gql";

interface CreateLootboxPayloadFE {
  backgroundImage: string;
  isExclusiveLootbox: boolean;
  // TODO use socials for this?
  joinCommunityUrl?: string;
  name: string;
  themeColor: string;
  tournamentID: TournamentID;
  headshot?: string;
  maxTickets?: number;
  /** If true, this will exempt the lootbox from event limits */
  isPromoterLootbox?: boolean;
  ticketValue?: string;
}

export interface UseLootboxInterface {
  createLootbox: (
    payload: CreateLootboxPayloadFE
  ) => Promise<{ lootbox: LootboxFE }>;
  loading: boolean;
}

const useLootbox = (): UseLootboxInterface => {
  const [loading, setLoading] = useState(false);

  const [createLootboxMutation] = useMutation<
    CreateLootboxResponseFE,
    { payload: CreateLootboxPayload }
  >(CREATE_LOOTBOX);

  const createLootbox = async (
    payload: CreateLootboxPayloadFE
  ): Promise<{ lootbox: LootboxFE }> => {
    setLoading(true);
    try {
      const response = await createLootboxMutation({
        variables: {
          payload: {
            backgroundImage: payload.backgroundImage,
            isExclusiveLootbox: payload.isExclusiveLootbox,
            joinCommunityUrl: payload.joinCommunityUrl,
            name: payload.name,
            themeColor: payload.themeColor,
            tournamentID: payload.tournamentID,
            maxTickets: payload.maxTickets,
            isPromoterLootbox: payload.isPromoterLootbox,
            nftBountyValue: payload.ticketValue,
            isStampV2: true,
            ...(payload.headshot && {
              stampMetadata: {
                playerHeadshot: payload.headshot,
              },
            }),
          },
        },
      });

      if (!response || !response.data) {
        throw new Error("An error occured");
      }

      if (response.data.createLootbox.__typename === "ResponseError") {
        throw new Error(response.data.createLootbox.error.message);
      }

      const coercedData = response.data
        .createLootbox as CreateLootboxResponseSuccessFE;

      return {
        lootbox: {
          id: coercedData.lootbox.id,
          name: coercedData.lootbox.name,
          stampImage: coercedData.lootbox.stampImage,
          backgroundImage: coercedData.lootbox.backgroundImage,
          themeColor: coercedData.lootbox.themeColor,
          timestamps: coercedData.lootbox.timestamps,
        },
      };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createLootbox,
    loading,
  };
};

export default useLootbox;
