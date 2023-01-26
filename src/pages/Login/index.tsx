import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, message, Result, Space } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { UserID } from "@wormgraph/helpers";
import rootStyles from "../../index.module.css";
import styles from "./index.module.css";
import SuppressedHeader from "../../components/Header/SuppressedHeader";
import LoginForm, { AuthFlowType } from "../../components/LoginForm";
import { FrontendUser } from "../../lib/types";
import { RoutesFE } from "../../routes.types";

const LoginPage = () => {
  const [flow, setFlow] = useState<AuthFlowType>("signup");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogin = (user: FrontendUser) => {
    message.success(`Welcome, ${user.username ?? "Player"}!`);
    setTimeout(() => {
      navigate({ pathname: RoutesFE.Home, search: location.search });
    }, 1200);
  };

  const handleAuthFlowChange = (flow: AuthFlowType) => {
    setFlow(flow);
  };

  const handleLogout = () => {
    setFlow("login");
    logout();
    message.success("You have been logged out.");
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader
        title={flow === "login" ? "Enter LOOTBOX" : "JOIN LOOTBOX"}
      />
      <div className={styles.loginFormContainer}>
        {user ? (
          <Result
            status="success"
            title="You are logged in!"
            subTitle="You can go to the home page."
            extra={[
              <Space direction="vertical">
                <Button
                  key="home"
                  type="primary"
                  onClick={() =>
                    navigate({
                      pathname: RoutesFE.Home,
                      search: location.search,
                    })
                  }
                >
                  Home
                </Button>
                <Button type="text" onClick={handleLogout}>
                  Logout
                </Button>
              </Space>,
            ]}
          />
        ) : (
          <LoginForm
            initFlow={flow}
            initLoginMode="email-password"
            onLoginCallback={onLogin}
            onAuthFlowChange={handleAuthFlowChange}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
