import { gql } from "@apollo/client";
import {
  ReferralID,
  ReferralSlug,
  TournamentID,
  LootboxCreatedNonce,
  LootboxID,
} from "@wormgraph/helpers";
import { ResponseError } from "../../api/graphql/generated/types";

export interface CreateEventResponseFE {
  createTournament:
    | {
        tournament: {
          id: TournamentID;
          title: string;
          timestamps: {
            createdAt: number;
          };
        };
        __typename: "CreateTournamentResponseSuccess";
      }
    | {
        error: {
          code: string;
          message: string;
        };
        __typename: "ResponseError";
      };
}

export const CREATE_EVENT = gql`
  mutation Mutation($payload: CreateTournamentPayload!) {
    createTournament(payload: $payload) {
      ... on CreateTournamentResponseSuccess {
        tournament {
          id
          title
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

export interface CreateReferralResponseFE {
  createReferral:
    | {
        referral: {
          id: ReferralID;
          slug: ReferralSlug;
        };
        __typename: "CreateReferralResponseSuccess";
      }
    | {
        error: {
          code: string;
          message: string;
        };
        __typename: "ResponseError";
      };
}

export const CREATE_REFERRAL = gql`
  mutation Mutation($payload: CreateReferralPayload!) {
    createReferral(payload: $payload) {
      ... on CreateReferralResponseSuccess {
        referral {
          id
          slug
        }
      }
      ... on ResponseError {
        error {
          message
          code
        }
      }
    }
  }
`;