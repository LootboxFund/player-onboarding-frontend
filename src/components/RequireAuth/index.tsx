import { Result, Spin } from "antd";
import { FunctionComponent, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type RequireAuthProps = {
  redirectTo: string;
  children: JSX.Element;
};

const RequireAuth: FunctionComponent<RequireAuthProps> = ({
  children,
  redirectTo,
}): JSX.Element => {
  const { user, signInAnonymously } = useAuth();

  useEffect(() => {
    if (user === undefined) {
      signInAnonymously();
    }
  }, [user, signInAnonymously]);

  if (user === undefined) {
    // Loading
    return (
      <Result
        icon={
          <Spin size="default" style={{ display: "block", margin: "auto" }} />
        }
      />
    );
  }

  return user ? children : <Navigate to={redirectTo} />;
};

export default RequireAuth;
