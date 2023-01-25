import { EventInviteType, UserSocials_Firestore } from "@wormgraph/helpers";
import { EventFE } from "./hooks/useEvent/api.gql";
import { LootboxFE, ReferralSnippetFE, UserMetadataFE } from "./lib/types";

export enum RoutesFE {
  Home = "/",
  CustomizeName = "/customize/name",
  CustomizeThemeColor = "/customize/color",
  CustomizeTicketValue = "/customize/value",
  CustomizePlayerEmail = "/customize/email",
  /** This is the final step in the creation process */
  CustomizePlayerHeadshot = "/customize/headshot",
  CustomizeFinish = "/customize/finish",
  ShareLootbox = "/share",
  EventChecklist = "/checklist",
  Basedir = "/join",
  Login = "/login",
}

export interface InviteLinkMetadata {
  event: EventFE;
  inviteType: EventInviteType;
}

export interface CustomizeNavState {
  coverImage: string;
  name: string;
  themeColor: string;
  userHeadshot?: string;
  userSocials?: UserSocials_Firestore;
  inviteLinkMetadata?: InviteLinkMetadata;
  ticketValue?: string; // only gets filled in on promoter lootboxes (auto fills player lootboxes)
}

export type CustomizeNavState_Name = Pick<
  CustomizeNavState,
  "coverImage" | "inviteLinkMetadata"
>;

export type CustomizeNavState_ThemeColor = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "inviteLinkMetadata"
>;

export type CustomizeNavState_TicketValue = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "inviteLinkMetadata"
>;

export type CustomizeNavState_UserEmail = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "inviteLinkMetadata" | "ticketValue"
>;

export type CustomizeNavState_UserHeadshot = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "inviteLinkMetadata" | "ticketValue"
>;

export type CustomizeNavState_UserSocials = Pick<
  CustomizeNavState,
  | "coverImage"
  | "name"
  | "themeColor"
  | "userHeadshot"
  | "inviteLinkMetadata"
  | "ticketValue"
>;

export type CustomizeNavState_CreateLootbox = Pick<
  CustomizeNavState,
  | "coverImage"
  | "name"
  | "themeColor"
  | "userHeadshot"
  | "inviteLinkMetadata"
  | "ticketValue"
>;

export interface ShareLootboxNavState {
  lootbox: LootboxFE;
  userMetadata: UserMetadataFE;
  referral?: ReferralSnippetFE;
  inviteLinkMetadata?: InviteLinkMetadata;
}

export interface EventChecklistNavState {
  inviteLinkMetadata?: InviteLinkMetadata;
}
