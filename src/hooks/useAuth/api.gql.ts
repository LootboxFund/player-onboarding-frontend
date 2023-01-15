import { gql } from "@apollo/client";
import { AffiliateID, UserID } from "@wormgraph/helpers";

export interface CreateUserRepsonseFE {
  createUserRecord:
    | {
        __typename: "CreateUserResponseSuccess";
        user: {
          id: UserID;
        };
      }
    | {
        __typename: "ResponseError";
        error: {
          code: string;
          message: string;
        };
      };
}

export const CREATE_USER = gql`
  mutation Mutation($payload: CreateUserRecordPayload!) {
    createUserRecord(payload: $payload) {
      ... on CreateUserResponseSuccess {
        user {
          id
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

export interface UpgradeToAffilitateResponseFE {
  upgradeToAffiliate:
    | {
        affiliate: {
          id: AffiliateID;
          userID: UserID;
        };
        __typename: "UpgradeToAffiliateResponseSuccess";
      }
    | {
        error: {
          code: string;
          message: string;
        };
      };
}

export const UPGRADE_TO_AFFILIATE = gql`
  mutation UpgradeToAffiliate {
    upgradeToAffiliate {
      ... on UpgradeToAffiliateResponseSuccess {
        affiliate {
          id
          userID
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
