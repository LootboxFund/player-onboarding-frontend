import { UserSocials_Firestore } from "@wormgraph/helpers";
import { LootboxFE, UserMetadataFE } from "./lib/types";

export enum RoutesFE {
  Home = "/",
  CustomizeName = "/customize/name",
  CustomizeThemeColor = "/customize/color",
  CustomizePlayerEmail = "/customize/email",
  /** This is the final step in the creation process */
  CustomizePlayerHeadshot = "/customize/headshot",
  ShareLootbox = "/share",
}

export interface CustomizeNavState {
  coverImage: string;
  name: string;
  themeColor: string;
  userHeadshot?: string;
  userSocials?: UserSocials_Firestore;
}

export type CustomizeNavState_Name = Pick<CustomizeNavState, "coverImage">;

export type CustomizeNavState_ThemeColor = Pick<
  CustomizeNavState,
  "coverImage" | "name"
>;

export type CustomizeNavState_UserEmail = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor"
>;

export type CustomizeNavState_UserHeadshot = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor"
>;

export type CustomizeNavState_UserSocials = Pick<
  CustomizeNavState,
  "coverImage" | "name" | "themeColor" | "userHeadshot"
>;

export interface ShareLootboxNavState {
  lootbox: LootboxFE;
  userMetadata: UserMetadataFE;
}
