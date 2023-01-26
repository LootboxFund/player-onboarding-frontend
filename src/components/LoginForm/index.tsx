import { Button, Input, Typography, message } from "antd";
import { EmailAuthProvider, sendEmailVerification } from "firebase/auth";
import { FunctionComponent, useEffect, useState } from "react";
import { auth } from "../../api/firebase";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../lib/email";
import styles from "./index.module.css";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { parseAuthError } from "../../lib/firebase";
import { FrontendUser } from "../../lib/types";
import { formatEmail } from "../../lib/email";

export type LoginMode = "anonymous" | "email-password";
export type AuthFlowType = "login" | "signup";

interface LoginFormProps {
  onLoginCallback: (user: FrontendUser) => void;
  onSignOutCallback?: () => void;
  onAuthFlowChange?: (flow: AuthFlowType) => void;
  initFlow?: AuthFlowType;
  initLoginMode?: LoginMode;
  /** if true, hides toggles that changes the login flow */
  isStreamline?: boolean;
  buttonText?: string;
  title?: string;
}

const LoginForm: FunctionComponent<LoginFormProps> = (props) => {
  const {
    user,
    signInWithEmailAndPassword,
    linkAnonAccountWithCredential,
    logout,
    signInAnonymously,
  } = useAuth();
  console.log("user", user);
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<LoginMode>(
    props.initLoginMode ?? "anonymous"
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [authFlowType, setAuthFlowType] = useState<AuthFlowType>(
    props.initFlow ?? "signup"
  );

  useEffect(() => {
    return () => {
      // cleanup
      setEmail("");
      setPassword("");
    };
  }, []);

  useEffect(() => {
    if (props.onAuthFlowChange) {
      props.onAuthFlowChange(authFlowType);
    }
  }, [authFlowType, props]);

  const handleSignUp = async () => {
    console.log("signing up....");

    if (loading) {
      return;
    }
    if (!email) {
      message.error("Please enter your email address");
      return;
    }
    if (!isValidEmail(email)) {
      message.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      message.error("Please enter your password");
      return;
    }
    if (password !== passwordConfirm) {
      message.error("Passwords do not match");
      return;
    }

    const loadingMessage = message.loading("Creating your account...", 0);

    // See if that user exists
    let emailSignInMethods: string[] = [];
    setLoading(true);
    try {
      emailSignInMethods = await fetchSignInMethodsForEmail(auth, email);
    } catch (err) {
      console.log("error fethcing sign in methods");
      message.error("An error occured. Please try again later.");
      loadingMessage();
      setLoading(false);
      return;
    }

    if (emailSignInMethods.length > 0) {
      // User already exists
      message.error("An account with that email already exists");
      loadingMessage();
      setLoading(false);
      return;
    }

    let loggedInUser: FrontendUser;
    try {
      // New user
      if (user?.isAnonymous) {
        loggedInUser = await linkAnonAccountWithCredential(
          EmailAuthProvider.credential(email, password)
        );
      } else {
        // This is a logged in  NON anonymous user (or logged out) user.
        // For breivity, we just
        // - logout
        // - signInAnonymously
        // - linkAnonAccountWithCredential

        await logout();
        await signInAnonymously(email);
        loggedInUser = await linkAnonAccountWithCredential(
          EmailAuthProvider.credential(email, password)
        );
        navigate("/");
      }
    } catch (err: any) {
      message.error(
        parseAuthError(
          err?.message || "An error occured. Please try again later."
        )
      );
      return;
    } finally {
      setLoading(false);
      loadingMessage();
    }

    props.onLoginCallback(loggedInUser);

    return;
  };

  const handleSignOut = async () => {
    try {
      await logout();
      message.success("Signed out successfully");
      setAuthFlowType("login");
      setLoginMode("email-password");
    } catch (err) {
      console.log("error logging out");
      message.error("An error occured. Please try again later.");
    }

    props.onSignOutCallback?.();
  };

  const toggleAuthType = () => {
    if (authFlowType === "signup") {
      setAuthFlowType("login");
    } else {
      setAuthFlowType("signup");
    }
  };

  const authHandler = async () => {
    if (authFlowType === "signup") {
      return handleSignUp();
    } else {
      return handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!email) {
      message.error("Please enter your email address");
      return;
    }
    const fmtEmail = formatEmail(email);
    if (!isValidEmail(fmtEmail)) {
      message.error("Please enter a valid email address");
      return;
    }
    if (loginMode !== "anonymous" && !password) {
      message.error("Please enter your password");
      return;
    }

    if (user && user.email && formatEmail(user.email) === fmtEmail) {
      // User is already logged in with this email
      // We dont need to do anything
      props.onLoginCallback(user);
      return;
    } else if (user && user.email && formatEmail(user.email) !== fmtEmail) {
      // Different email, log the user out and sign them in the default flow
      await logout();
    } else if (user) {
      await logout();
    }

    // See if that user exists
    let emailSignInMethods: string[] = [];
    setLoading(true);
    const loadingMessage = message.loading("Logging in...", 0);
    try {
      emailSignInMethods = await fetchSignInMethodsForEmail(auth, email);
    } catch (err) {
      console.log("error fethcing sign in methods");
      message.error("An error occured. Please try again later.");
      setLoading(false);
      loadingMessage();
      return;
    }

    try {
      if (emailSignInMethods.length === 0) {
        if (loginMode === "anonymous") {
          // We just sign them in anonymously
          const loggedInUser = await signInAnonymously(email);

          props.onLoginCallback(loggedInUser);
          return;
        } else {
          // User does not exist
          // For security, send to email - password login
          throw new Error("Incorrect email or password");
        }
      } else if (emailSignInMethods.includes("password")) {
        if (loginMode === "email-password") {
          const loggedInUser = await signInWithEmailAndPassword(
            email,
            password
          );
          props.onLoginCallback(loggedInUser);
          return;
        } else {
          // the user must log in, we change the form instance
          setLoginMode("email-password");
          return;
        }
      } else {
        // Existing user with a different method
        // Right now we dont support other login methods
        throw new Error("Please add a password to your account to sign in.");
      }
    } catch (err: any) {
      console.log("error logging in");
      message.error(
        parseAuthError(
          err?.message || "An error occured. Please try again later."
        )
      );
    } finally {
      setLoading(false);
      loadingMessage();
      return;
    }
  };

  return (
    <div className={styles.formContainer}>
      {props.title && <Typography.Title>{props.title}</Typography.Title>}
      <br />
      <Input
        size="large"
        value={email}
        onChange={(e) => setEmail(e.target.value ?? "")}
        placeholder="Enter email"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            authHandler();
          }
        }}
      />
      <br />
      {(loginMode === "email-password" || authFlowType === "signup") && [
        <Input
          key="password-input"
          type="password"
          size="large"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value ?? "")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              authHandler();
            }
          }}
        />,
        <br key="br1" />,
      ]}
      {authFlowType === "signup" && [
        <Input
          key="password-confirm-input"
          type="password"
          size="large"
          placeholder="Confirm password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value ?? "")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              authHandler();
            }
          }}
        />,
        <br key="br2" />,
      ]}
      <Button
        type="primary"
        size="large"
        style={{ width: "100%" }}
        onClick={authHandler}
        loading={loading}
        disabled={loading}
      >
        {props.buttonText
          ? props.buttonText
          : authFlowType === "signup"
          ? "Sign Up"
          : "Log In"}
      </Button>
      <br />
      <br />

      {!props.isStreamline && (
        <Button type="text" onClick={toggleAuthType}>
          {authFlowType === "signup"
            ? "Already have an account? Log in."
            : "Don't have an account? Sign up."}
        </Button>
      )}

      {!props.isStreamline && user && !user.isAnonymous && (
        <Button
          type="text"
          onClick={handleSignOut}
          style={{ marginTop: "12px" }}
        >
          Sign out
        </Button>
      )}
    </div>
  );
};

export default LoginForm;
