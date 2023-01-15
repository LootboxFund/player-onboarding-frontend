import { Result, Spin } from "antd";
import { FunctionComponent, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSkeleton from "../LoadingSkeleton";

type RequireAuthProps = {
  redirectTo: string;
  children: JSX.Element;
};

const RequireAuth: FunctionComponent<RequireAuthProps> = ({
  children,
  redirectTo,
}): JSX.Element => {
  const { user } = useAuth();

  if (user === undefined) {
    // Loading
    return <LoadingSkeleton />;
  }

  return user ? children : <Navigate to={redirectTo} />;
};

export default RequireAuth;
