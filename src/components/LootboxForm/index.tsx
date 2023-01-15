export { default as LootboxNameForm } from "./components/LootboxName";
export { default as LootboxThemeColorForm } from "./components/LootboxThemeColor";
// import { Button, Typography, Input } from "antd";
// import { FunctionComponent, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LeftCircleOutlined } from "@ant-design/icons";
// import LootboxNameForm from "./components/LootboxName";
// import LootboxThemeColorForm from "./components/LootboxThemeColor";
// import styles from "./index.module.css";

// export interface LootboxFormProps {
//   onComplete: (state: LootboxFormState) => void;
//   onStatusChange?: (status: LootboxFormStatus, state: LootboxFormState) => void;
// }

// export interface LootboxFormState {
//   name: string;
//   themeColor: string;
//   userEmail: string;
// }

// export type LootboxFormStatus = "lootboxName" | "themeColor" | "userEmail";
// // Order in which they appear
// const statusOrder: LootboxFormStatus[] = [
//   "lootboxName",
//   "themeColor",
//   "userEmail",
// ];

// const LootboxForm: FunctionComponent<LootboxFormProps> = (props) => {
//   const [status, setStatus] = useState<LootboxFormStatus>("lootboxName");
//   const [lootboxState, setLootboxState] = useState<LootboxFormState>({
//     name: "",
//     themeColor: "",
//     userEmail: "",
//   });
//   const navigate = useNavigate();

//   const handleBack = () => {
//     const currentIndex = statusOrder.indexOf(status);
//     if (currentIndex === 0) {
//       navigate(-1);
//     } else {
//       setStatus(statusOrder[currentIndex - 1]);
//     }
//   };

//   const moveToNextStatus = () => {
//     const currentIndex = statusOrder.indexOf(status);
//     if (currentIndex === statusOrder.length - 1) {
//       props.onComplete(lootboxState);
//     } else {
//       setStatus(statusOrder[currentIndex + 1]);
//     }
//   };

//   const handleNameNext = (name: string) => {
//     setLootboxState((prevState) => ({ ...prevState, name }));
//     moveToNextStatus();
//   };

//   const handleThemeColorNext = (themeColor: string) => {
//     setLootboxState((prevState) => ({ ...prevState, themeColor }));
//     moveToNextStatus();
//   };

//   if (status === "lootboxName") {
//     return <LootboxNameForm onBack={handleBack} onNext={handleNameNext} />;
//   }

//   if (status === "themeColor") {
//     return (
//       <LootboxThemeColorForm
//         onBack={handleBack}
//         onNext={handleThemeColorNext}
//       />
//     );
//   }

//   return <div className={styles.formContainer}>Customize Lootbox</div>;
// };

// export default LootboxForm;
