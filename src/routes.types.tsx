import { UserSocials_Firestore } from "@wormgraph/helpers";
import { EventFE } from "./hooks/useEvent/api.gql";
import { LootboxFE, ReferralFE, UserMetadataFE } from "./lib/types";

export enum RoutesFE {
  Home = "/",
  CustomizeName = "/customize/name",
  CustomizeThemeColor = "/customize/color",
  CustomizePlayerEmail = "/customize/email",
  /** This is the final step in the creation process */
  CustomizePlayerHeadshot = "/customize/headshot",
  CustomizeFinish = "/customize/finish",
  ShareLootbox = "/share",
  Basedir = "/join",
  Login = "/login",
}

export interface CustomizeNavState {
  coverImage: string;
  name: string;
  themeColor: string;
  userHeadshot?: string;
  userSocials?: UserSocials_Firestore;
  event?: EventFE;
}

export type CustomizeNavState_Name = Pick<
  CustomizeNavState,
  "coverImage" | "event"
>;

export type CustomizeNavState_ThemeColor = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "event"
>;

export type CustomizeNavState_UserEmail = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "event"
>;

export type CustomizeNavState_UserHeadshot = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "event"
>;

export type CustomizeNavState_UserSocials = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "userHeadshot" | "event"
>;

export type CustomizeNavState_CreateLootbox = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "userHeadshot" | "event"
>;

export interface ShareLootboxNavState {
  lootbox: LootboxFE;
  userMetadata: UserMetadataFE;
  referral: ReferralFE;
  event?: EventFE;
}
