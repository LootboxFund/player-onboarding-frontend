import { message, Modal, Typography } from "antd";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FrontendUser } from "../../lib/types";
import LoginForm from "../LoginForm";
import styles from "./index.module.css";

const WhoAmI = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleLogin = (user: FrontendUser) => {
    message.success("Welcome, " + user.username + "!");
    closeModal();
  };

  return (
    <div className={styles.whoAmIContainer}>
      <br />
      {!user?.email ? (
        <Typography.Text
          type="secondary"
          onClick={showModal}
          style={{ cursor: "pointer" }}
        >
          Unverified User (click to login)
        </Typography.Text>
      ) : (
        <Typography.Text ellipsis type="secondary">
          {user.email}
        </Typography.Text>
      )}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        okButtonProps={{ style: { display: "none" } }}
      >
        <LoginForm
          onLoginCallback={handleLogin}
          title="🎁 Join Lootbox"
          initLoginMode="email-password"
        />
        <br />
      </Modal>
    </div>
  );
};

export default WhoAmI;
