import { gql } from "@apollo/client";
import {
  ReferralID,
  ReferralSlug,
  TournamentID,
  LootboxCreatedNonce,
  LootboxID,
} from "@wormgraph/helpers";
import { ResponseError, Tournament } from "../../api/graphql/generated/types";

export interface EventFE {
  id: TournamentID;
  title: string;
  inviteMetadata: {
    slug: string;
    playerDestinationURL: string | null;
    promoterDestinationURL: string | null;
  };
  stampMetadata: {
    logoURLs: string[];
  };
  tournamentDate: number | null;
  prize: string | null;
  communityURL: string | null;
}

export interface EventPartnerViewResponseFE {
  eventPartnerView:
    | {
        event: EventFE;
        __typename: "EventPartnerViewResponseSuccess";
      }
    | {
        error: ResponseError;
        __typename: "ResponseError";
      };
}

export const GET_EVENT_BY_SLUG = gql`
  query EventPartnerView($slug: String!) {
    eventPartnerView(slug: $slug) {
      ... on EventPartnerViewResponseSuccess {
        event {
          id
          title
          inviteMetadata {
            slug
            playerDestinationURL
            promoterDestinationURL
            maxPlayerLootbox
            maxPromoterLootbox
          }
          stampMetadata {
            logoURLs
          }
          tournamentDate
          prize
          communityURL
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
          inviteGraphic: string | null;
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
          inviteGraphic
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
