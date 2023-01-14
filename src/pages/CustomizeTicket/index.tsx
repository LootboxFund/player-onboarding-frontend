import { FunctionComponent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SuppressedHeader from "../../components/Header/SuppressedHeader";
import rootStyles from "../../index.module.css";
import styles from "./index.module.css";
import { CustomizeTicketNavState, RoutesFE } from "../../routes.types";
import { Button, Col, Row, Typography, Input } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import LootboxForm, {
  LootboxFormState,
  LootboxFormStatus,
} from "../../components/LootboxForm";

const CustomizeTicket: FunctionComponent = () => {
  const navigate = useNavigate();
  const { state }: { state: CustomizeTicketNavState } = useLocation();

  useEffect(() => {
    if (!state.coverImage) {
      console.log("no data, redirecting to home");
      navigate(RoutesFE.Home, { replace: true });
    }
  }, [state, navigate]);

  const handleLootboxSubmission = (state: LootboxFormState) => {
    console.log("state", state);
  };

  const handleStatusChange = (
    status: LootboxFormStatus,
    state: LootboxFormState
  ) => {
    console.log("status", status);
    console.log("state", state);
  };

  return (
    <div className={rootStyles.responsivePageContainer}>
      <SuppressedHeader />
      <div
        className={styles.customizeMainContainer}
        style={{
          backgroundImage: `url(${state.coverImage})`,
        }}
      ></div>
      <div className={styles.floatingButtonContainer}>
        <div className={styles.floatingButtonContainerContent}>
          <LootboxForm
            onComplete={handleLootboxSubmission}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizeTicket;
