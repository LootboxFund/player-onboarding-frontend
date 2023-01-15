import { gql } from "@apollo/client";
import { UserID } from "@wormgraph/helpers";

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
