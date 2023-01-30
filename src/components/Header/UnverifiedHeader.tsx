import { message, Modal, Typography } from "antd";
import { useState } from "react";
import { FrontendUser } from "../../lib/types";
import LoginForm from "../LoginForm";
import styles from "./index.module.css";

const UnverifiedHeader = () => {
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
    <div className={styles.unverifiedHeaderContainer}>
      <div
        onClick={showModal}
        style={{ width: "100%", height: "100%", cursor: "pointer" }}
      >
        <Typography.Text
          style={{
            color: "var(--color-red)",
            fontWeight: 800,
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Don't loose your Lootbox. Click to verify your account.
        </Typography.Text>
      </div>
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
      </Modal>
    </div>
  );
};

export default UnverifiedHeader;
