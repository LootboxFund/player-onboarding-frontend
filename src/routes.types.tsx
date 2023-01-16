import { UserSocials_Firestore } from "@wormgraph/helpers";
import { LootboxFE, UserMetadataFE } from "./lib/types";

export enum RoutesFE {
  Home = "/",
  CustomizeName = "/customize/name",
  CustomizeThemeColor = "/customize/color",
  CustomizePlayerEmail = "/customize/email",
  /** This is the final step in the creation process */
  CustomizePlayerHeadshot = "/customize/headshot",
  CustomizeFinish = "/customize/finish",
  ShareLootbox = "/share",
}

interface _CustomizeNavState {
  coverImage: string;
  name: string;
  themeColor: string;
  userHeadshot?: string;
  userSocials?: UserSocials_Firestore;
}

export type CustomizeNavState_Name = Pick<_CustomizeNavState, "coverImage">;

export type CustomizeNavState_ThemeColor = Pick<
  _CustomizeNavState,
  "coverImage" | "name"
>;

export type CustomizeNavState_UserEmail = Pick<
  _CustomizeNavState,
  "coverImage" | "name" | "themeColor"
>;

export type CustomizeNavState_UserHeadshot = Pick<
  _CustomizeNavState,
  "coverImage" | "name" | "themeColor"
>;

export type CustomizeNavState_UserSocials = Pick<
  _CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "userHeadshot"
>;

export type CustomizeNavState_CreateLootbox = Pick<
  _CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "userHeadshot"
>;

export interface ShareLootboxNavState {
  lootbox: LootboxFE;
  userMetadata: UserMetadataFE;
}
