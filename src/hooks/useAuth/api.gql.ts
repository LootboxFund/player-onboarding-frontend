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

export interface MySocialsFE {
  twitter: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  discord: string | null;
  snapchat: string | null;
  twitch: string | null;
  web: string | null;
}

export interface UserDB {
  email?: string;
  username?: string;
  avatar?: string;
  biography?: string;
  headshot?: [string];
  socials: MySocialsFE;
}

export type MyProfileFE = {
  getMyProfile:
    | {
        __typename: "GetMyProfileSuccess";
        user: UserDB;
      }
    | {
        __typename: "ResponseError";
        error: {
          code: string;
          message: string;
        };
      };
};

export const GET_MY_PROFILE = gql`
  query User {
    getMyProfile {
      ... on GetMyProfileSuccess {
        user {
          username
          avatar
          biography
          headshot
          email
          socials {
            twitter
            instagram
            tiktok
            facebook
            discord
            snapchat
            twitch
            web
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
