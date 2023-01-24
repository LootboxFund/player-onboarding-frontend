import {
  LootboxID,
  ReferralID,
  ReferralSlug,
  TournamentID,
  UserID,
} from "@wormgraph/helpers";

export interface CreatedEventFE {
  id: TournamentID;
  title: string;
  createdAt: number;
}

export interface ReferralFE {
  id: ReferralID;
  slug: ReferralSlug;
  inviteImage?: string;
}

export interface LootboxFE {
  id: LootboxID;
  name: string;
  stampImage: string;
  themeColor: string;
  backgroundImage: string;
}

export interface FrontendUser {
  id: UserID;
  email: string | null;
  phone: string | null;
  isEmailVerified: boolean;
  username: string | null;
  avatar: string | null;
  isAnonymous: boolean;
}

export interface UserMetadataFE {
  headshot?: string;
}
