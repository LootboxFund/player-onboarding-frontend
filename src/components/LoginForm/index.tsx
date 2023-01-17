import { Button, Input, message } from "antd";
import { EmailAuthProvider } from "firebase/auth";
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

type LoginMode = "anonymous" | "email-password";
type AuthFlowType = "login" | "signup";

interface LoginFormProps {
  onLoginCallback: (user: FrontendUser) => void;
  onSignOutCallback?: () => void;
  initFlow?: AuthFlowType;
}

const LoginForm: FunctionComponent<LoginFormProps> = (props) => {
  const {
    user,
    signInWithEmailAndPassword,
    linkAnonAccountWithCredential,
    logout,
    signInAnonymously,
  } = useAuth();
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<LoginMode>("anonymous");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [authFlowType, setAuthFlowType] = useState<AuthFlowType>(
    props.initFlow || "signup"
  );

  useEffect(() => {
    return () => {
      // cleanup
      setEmail("");
      setPassword("");
    };
  }, []);

  const handleSignUp = async () => {
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
      console.log("error logging in", err);
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

    message.success(`Welcome ${loggedInUser?.username || "Friend"}!`);

    props.onLoginCallback(loggedInUser);

    return;
  };

  const handleLogin = async () => {
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

    const loadingMessage = message.loading("Logging in...", 0);

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

    let loggedInUser: FrontendUser;

    if (emailSignInMethods.length === 0) {
      // User does not exist
      message.error("Invalid email or password");
      loadingMessage();
      setLoading(false);
      return;
    }

    try {
      // Existing user - we just log them in

      if (emailSignInMethods.includes("password")) {
        // We only support password for now
        // WARNING: for now they will loose this event
        loggedInUser = await signInWithEmailAndPassword(email, password);
        navigate("/");
      } else {
        // Existing user with a different method
        // Right now we dont support other login methods
        throw new Error("Please add a password to your account to sign in.");
      }
    } catch (err: any) {
      console.log("error logging in", err);
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

    message.success(`Welcome ${loggedInUser?.username || "Friend"}!`);
    props.onLoginCallback(loggedInUser);

    return;
  };

  const handleSignOut = async () => {
    try {
      await logout();
      message.success("Signed out successfully");
      navigate("/");
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
    if (loginMode === "anonymous") {
      return handleAnonSignUp();
    } else {
      throw new Error("Not implemented");
    }
  };

  const handleAnonSignUp = async () => {
    if (!email) {
      message.error("Please enter your email address");
      return;
    }
    const fmtEmail = formatEmail(email);
    if (!isValidEmail(fmtEmail)) {
      message.error("Please enter a valid email address");
      return;
    }

    // if (user && user.email && formatEmail(user.email) === fmtEmail) {
    //   // User is already logged in with this email
    //   // We dont need to do anything
    //   props.onLoginCallback(user);
    //   return;
    // } else if (user && user.email && formatEmail(user.email) !== fmtEmail) {
    //   // Different email, log the user out and sign them in the default flow
    //   await logout();
    // } else if (user) {
    //   // User is logged in but has no email...
    // }
    if (user) {
      props.onLoginCallback(user);
      return;
    }

    // TODO: AUTH FLOW
    const createdUser = await signInAnonymously();
    props.onLoginCallback(createdUser);
    return;

    // // See if that user exists
    // let emailSignInMethods: string[] = [];
    // setLoading(true);
    // try {
    //   emailSignInMethods = await fetchSignInMethodsForEmail(auth, email);
    // } catch (err) {
    //   console.log("error fethcing sign in methods");
    //   message.error("An error occured. Please try again later.");
    //   setLoading(false);
    //   return;
    // }

    // if (emailSignInMethods.length === 0) {
    //   // We just sign them in anonymously
    //   const user = await signInAnonymously(email);
    //   // TODO SEND the verification email

    //   props.onLoginCallback(user);
    //   return;
    // } else if (emailSignInMethods.includes("password")) {
    //   // the user must log in, we change the form instance
    //   setLoginMode("email-password");
    //   return;
    // } else {
    //   // Existing user with a different method
    //   // Right now we dont support other login methods
    //   message.error("Please add a password to your account to sign in.");
    //   return;
    // }
  };

  return (
    <div className={styles.formContainer}>
      <br />
      <Input
        size="large"
        value={email}
        onChange={(e) => setEmail(e.target.value ?? "")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            authHandler();
          }
        }}
      />
      <br />
      {loginMode === "email-password" && [
        <Input
          key="password-input"
          type="password"
          size="large"
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
      <Button
        type="primary"
        size="large"
        style={{ width: "100%" }}
        onClick={authHandler}
      >
        Finish
      </Button>
    </div>
  );
};

export default LoginForm;
