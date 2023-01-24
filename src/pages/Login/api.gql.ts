// import { gql } from "@apollo/client";
// import { UserID } from "@wormgraph/helpers";
// import { ResponseError } from "../../api/graphql/generated/types";

// export interface GetAnonTokenResponseSuccessFE {
//   getAnonTokenV2: {
//     __typename: "GetAnonTokenResponseSuccess";
//     token: string;
//     email: string;
//   };
// }

// export const GET_ANON_TOKEN = gql`
//   query GetAnonTokenV2($userID: ID!) {
//     getAnonTokenV2(userID: $userID) {
//       ... on GetAnonTokenResponseSuccess {
//         token
//         email
//       }
//       ... on ResponseError {
//         error {
//           code
//           message
//         }
//       }
//     }
//   }
// `;

// export type SyncProviderUserResponseFE = {
//   syncProviderUser:
//     | {
//         __typename: "SyncProviderUserResponseSuccess";
//         user: {
//           phoneNumber: string | null;
//           email: string | null;
//           id: UserID;
//         };
//       }
//     | ResponseError;
// };

// export const SYNC_PROVIDER_USER = gql`
//   mutation syncProviderUser {
//     syncProviderUser {
//       ... on SyncProviderUserResponseSuccess {
//         user {
//           phoneNumber
//           email
//           id
//         }
//       }
//       ... on ResponseError {
//         error {
//           code
//           message
//         }
//       }
//     }
//   }
// `;

export {};
