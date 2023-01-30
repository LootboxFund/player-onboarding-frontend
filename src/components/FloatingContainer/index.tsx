import { Button, Result, Spin, Typography } from "antd";
import {
  LeftCircleOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { FunctionComponent, PropsWithChildren, useRef, useState } from "react";
import styles from "./index.module.css";

export interface FloatingContainerProps {
  handleBack: () => void;
  title: string;
  loading?: boolean;
  loadingMessage?: string;
}

const FloatingContainer: FunctionComponent<
  PropsWithChildren<FloatingContainerProps>
> = (props) => {
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerContentRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    if (!titleRef?.current || !containerContentRef.current) {
      return;
    }

    if (isMenuHidden) {
      containerContentRef.current.style.transform = `translateY(0px)`;
      setIsMenuHidden(false);
    } else {
      const newBottom =
        containerContentRef.current.offsetHeight -
        (titleRef.current.offsetTop + titleRef.current.offsetHeight) -
        10;
      containerContentRef.current.style.transform = `translateY(${newBottom}px)`;
      setIsMenuHidden(true);
    }
  };

  return (
    <div className={styles.floatingButtonContainer}>
      {props.loading ? (
        <Result
          style={{ padding: "12px" }}
          icon={<Spin />}
          {...(props.loadingMessage
            ? { subTitle: props.loadingMessage }
            : { title: "Loading..." })}
        />
      ) : (
        <div
          className={styles.floatingButtonContainerContent}
          ref={containerContentRef}
        >
          <Typography.Title level={4} style={{ width: "100%" }} ref={titleRef}>
            <Button
              type="text"
              size="large"
              icon={<LeftCircleOutlined />}
              onClick={props.handleBack}
            />
            &nbsp; {props.title}
            <Button
              type="text"
              size="large"
              icon={isMenuHidden ? <UpOutlined /> : <DownOutlined />}
              onClick={handleMenuToggle}
            />
          </Typography.Title>
          <br />
          {props.children}
        </div>
      )}
    </div>
  );
};

export default FloatingContainer;
