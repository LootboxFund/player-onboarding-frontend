import { Button, Input, message } from "antd";
import { FunctionComponent, useState } from "react";
import styles from "../index.module.css";

export interface LootboxNameProps {
  initialValue?: string;
  onNext: (name: string) => void;
  onChange?: (name: string) => void;
}

const ticketValueMaxLength = 16;

const TicketValue: FunctionComponent<LootboxNameProps> = (props) => {
  const [ticketValue, setTicketValue] = useState("");

  const handleOnNext = () => {
    if (ticketValue.length > ticketValueMaxLength) {
      message.error(
        `Ticket value must be ${ticketValueMaxLength} characters or less`
      );
      return;
    }

    props.onNext(ticketValue);
  };

  const handleOnChange = (newName: string) => {
    setTicketValue(newName);
    props.onChange && props.onChange(newName);
  };

  return (
    <div className={styles.formContainer}>
      <Input
        size="large"
        value={ticketValue}
        onChange={(e) => handleOnChange(e.target.value ?? "")}
        placeholder="i.e. $20 USD"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOnNext();
          }
        }}
      />
      <br />
      <Button
        type="primary"
        size="large"
        style={{ width: "100%" }}
        onClick={handleOnNext}
      >
        Next
      </Button>
    </div>
  );
};

export default TicketValue;
