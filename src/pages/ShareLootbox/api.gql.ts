import { gql } from "@apollo/client";
import { ResponseError } from "../../api/graphql/generated/types";
import { LootboxFE } from "../../lib/types";

export type GetLootboxResponseFE = {
  getLootboxByID:
    | {
        __typename: "LootboxResponseSuccess";
        lootbox: LootboxFE;
      }
    | ResponseError;
};

export const GET_LOOTBOX = gql`
  query Query($id: ID!) {
    getLootboxByID(id: $id) {
      ... on LootboxResponseSuccess {
        lootbox {
          id
          name
          stampImage
          themeColor
          backgroundImage
          officialInviteLink
          officialInviteGraphic
          timestamps {
            createdAt
          }
        }
      }
      ... on ResponseError {
        error {
          code
          message
        }
      }
    }
  }
`;
