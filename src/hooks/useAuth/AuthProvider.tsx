import {
  User,
  signInAnonymously as signInAnonymouslyFirebase,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  EmailAuthCredential,
  linkWithCredential,
} from "firebase/auth";
import { auth } from "../../api/firebase";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { UserID } from "@wormgraph/helpers";
import client from "../../api/graphql/client";
import { useMutation } from "@apollo/client";
import {
  CreateUserRecordPayload,
  MutationCreateUserRecordArgs,
} from "../../api/graphql/generated/types";
import { CREATE_USER, CreateUserRepsonseFE } from "./api.gql";
import { isValidEmail } from "../../lib/email";

export interface FrontendUser {
  id: UserID;
  email: string | null;
  phone: string | null;
  isEmailVerified: boolean;
  username: string | null;
  avatar: string | null;
  isAnonymous: boolean;
}

export interface AuthContextType {
  user: FrontendUser | null | undefined;
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

  const [createUserMutation] = useMutation<
    CreateUserRepsonseFE,
    MutationCreateUserRecordArgs
  >(CREATE_USER);

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

    await _refreshUser();

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

    // setAuthPersistence()

    const { user } = await signInWithEmailAndPasswordFirebase(
      auth,
      email,
      password
    );

    await _refreshUser();

    // // Send email verification only once on login
    // const verificationEmailAlreadySent = localStorage.getItem(EMAIL_VERIFICATION_COOKIE_NAME)

    // if (!!user.email && !user.emailVerified && !verificationEmailAlreadySent) {
    //   sendEmailVerification(user)
    //     .then(() => {
    //       console.log('email verification sent')
    //       localStorage.setItem(EMAIL_VERIFICATION_COOKIE_NAME, 'true')
    //     })
    //     .catch((err) => LogRocket.captureException(err))
    // }

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
      // } else if (user.id !== auth.currentUser.uid) {
      //   throw new Error("User ID mismatch");
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
