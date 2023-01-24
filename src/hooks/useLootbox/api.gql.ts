import { gql } from "@apollo/client";
import { ResponseError } from "../../api/graphql/generated/types";
import { LootboxFE } from "../../lib/types";

export interface CreateLootboxResponseSuccessFE {
  __typename: "CreateLootboxResponseSuccess";
  lootbox: LootboxFE;
}

export interface CreateLootboxResponseFE {
  createLootbox: ResponseError | CreateLootboxResponseSuccessFE;
}

export const CREATE_LOOTBOX = gql`
  mutation CreateLootboxMutation($payload: CreateLootboxPayload!) {
    createLootbox(payload: $payload) {
      ... on CreateLootboxResponseSuccess {
        lootbox {
          id
          name
          stampImage
          themeColor
          backgroundImage
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

// export interface BulkCreateLootboxResponseFE {
//   bulkCreateLootbox:
//     | {
//         lootboxes: {
//           name: string;
//           id: string;
//         }[];
//         partialErrors: {
//           error: string;
//         }[];
//         __typename: "BulkCreateLootboxResponseSuccess";
//       }
//     | {
//         error: {
//           message: string;

//           code: string;
//         };
//         __typename: "ResponseError";
//       };
// }

// export const BULK_CREATE_LOOTBOX = gql`
//   mutation BulkCreateLootbox($payload: BulkCreateLootboxPayload!) {
//     bulkCreateLootbox(payload: $payload) {
//       ... on BulkCreateLootboxResponseSuccess {
//         lootboxes {
//           name
//           id
//         }
//         partialErrors {
//           error
//         }
//       }
//       ... on ResponseError {
//         error {
//           message
//           code
//         }
//       }
//     }
//   }
// `;
