import { FunctionComponent } from "react";
import styles from "../index.module.css";
import LoginForm from "../../LoginForm";
import { FrontendUser } from "../../../lib/types";

export interface PlayerEmailProps {
  onNext: (user: FrontendUser) => void;
}

const PlayerEmail: FunctionComponent<PlayerEmailProps> = (props) => {
  const handleOnNext = (user: FrontendUser) => {
    props.onNext(user);
  };

  return (
    <div className={styles.formContainer}>
      <LoginForm
        onLoginCallback={handleOnNext}
        initLoginMode="anonymous"
        initFlow="login"
        isStreamline={true}
        buttonText="Finish"
      />
    </div>
  );
};

export default PlayerEmail;
