import {
  User,
  signInAnonymously as signInAnonymouslyFirebase,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  EmailAuthCredential,
  linkWithCredential,
} from "firebase/auth";
import { auth } from "../../api/firebase";
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserID } from "@wormgraph/helpers";
import client from "../../api/graphql/client";
import { useMutation, useQuery } from "@apollo/client";
import {
  CreateUserRecordPayload,
  MutationCreateUserRecordArgs,
} from "../../api/graphql/generated/types";
import {
  CREATE_USER,
  CreateUserRepsonseFE,
  UpgradeToAffilitateResponseFE,
  UPGRADE_TO_AFFILIATE,
  GET_MY_PROFILE,
  MyProfileFE,
  UserDB,
} from "./api.gql";
import { isValidEmail, truncateEmail } from "../../lib/email";
import { FrontendUser } from "../../lib/types";

export interface AuthContextType {
  /** this is from firebase AUTH */
  user: FrontendUser | null | undefined;
  /** this is from GQL query to firestore */
  userDB: UserDB | null | undefined;
  signInAnonymously: (email?: string) => Promise<FrontendUser>;
  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<FrontendUser>;
  linkAnonAccountWithCredential: (
    credential: EmailAuthCredential
  ) => Promise<FrontendUser>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {}

const AuthProvider = ({ children }: PropsWithChildren<AuthProviderProps>) => {
  /**
   * user = undefined -> unset (loading)
   * user = null -> unauthenticated
   * user = USER -> authenticated
   */
  const [user, setUser] = useState<FrontendUser | null | undefined | null>(
    undefined
  );

  const { data: userProfileData, refetch: refetchUserDB } =
    useQuery<MyProfileFE>(GET_MY_PROFILE, {
      skip: !user,
    });
  const userDB: UserDB | null = useMemo(() => {
    if (!userProfileData) return null;
    return userProfileData?.getMyProfile?.__typename === "GetMyProfileSuccess"
      ? userProfileData.getMyProfile.user
      : null;
  }, [userProfileData]);

  const [createUserMutation] = useMutation<
    CreateUserRepsonseFE,
    MutationCreateUserRecordArgs
  >(CREATE_USER);

  const [upgradeToAffiliateMutation] =
    useMutation<UpgradeToAffilitateResponseFE>(UPGRADE_TO_AFFILIATE);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = convertUserToUserFE(user);
        setUser(userData);
      } else {
        setUser(null);
      }
      client.resetStore();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const _refreshUser = async (): Promise<FrontendUser | null> => {
    await auth.currentUser?.reload();
    const newUser = auth.currentUser
      ? convertUserToUserFE(auth.currentUser)
      : null;
    setUser(newUser);

    return newUser;
  };

  const signInAnonymously = async (email?: string): Promise<FrontendUser> => {
    // Sign in anonymously
    const { user } = await signInAnonymouslyFirebase(auth);

    // Now create a user record
    const createUserPayload: CreateUserRecordPayload = {};
    if (!user.email && !!email) {
      createUserPayload.email = email;
    }

    await createUserMutation({ variables: { payload: createUserPayload } });
    await upgradeToAffiliateMutation(); // Upgrades to affilite

    await _refreshUser();
    // Refresh GQL Query
    refetchUserDB();

    return convertUserToUserFE(user);
  };

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ): Promise<FrontendUser> => {
    if (!email) {
      throw new Error("Email is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (!isValidEmail(email)) {
      throw new Error("Invalid email");
    }

    const { user } = await signInWithEmailAndPasswordFirebase(
      auth,
      email,
      password
    );

    await _refreshUser();

    return convertUserToUserFE(user);
  };

  const logout = async (): Promise<void> => {
    await auth.signOut();

    await _refreshUser();
  };

  const linkAnonAccountWithCredential = async (
    credential: EmailAuthCredential
  ): Promise<FrontendUser> => {
    if (!auth?.currentUser || !auth.currentUser) {
      throw new Error("No user logged in");
    } else if (!auth.currentUser.isAnonymous) {
      throw new Error("User is not anonymous");
    }

    const result = await linkWithCredential(auth.currentUser, credential);
    await _refreshUser();

    return convertUserToUserFE(result.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDB,
        signInAnonymously,
        signInWithEmailAndPassword,
        linkAnonAccountWithCredential,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const convertUserToUserFE = (user: User): FrontendUser => {
  const {
    uid,
    email,
    phoneNumber,
    displayName,
    photoURL,
    emailVerified,
    isAnonymous,
  } = user;

  const userData: FrontendUser = {
    id: uid as UserID,
    email: email,
    phone: phoneNumber,
    isEmailVerified: emailVerified,
    username: displayName,
    avatar: photoURL,
    isAnonymous,
  };
  return userData;
};

export default AuthProvider;
