import { UserSocials_Firestore } from "@wormgraph/helpers";
import { useLocalStorage } from "../useLocalStorage";

export interface CustomizeCacheState {
  coverImage?: string;
  name?: string;
  themeColor?: string;
  userHeadshot?: string;
  userSocials?: UserSocials_Firestore;
}

export interface CustomizeCacheInterface {
  name: CustomizeCacheState["name"];
  themeColor: CustomizeCacheState["themeColor"];
  userHeadshot: CustomizeCacheState["userHeadshot"];
  setName: (name: string) => void;
  setThemeColor: (color: string) => void;
  setUserHeadshot: (headshot?: string) => void;
  clearState: () => void;
}

/**
 * Loads state from magic link and / or stores it in local storage for later use
 * @param props
 * @returns
 */
const useCustomizeCache = (): CustomizeCacheInterface => {
  const [state, setState] = useLocalStorage<CustomizeCacheState | null>(
    "customizeCache",
    null
  );

  const setThemeColor = (color: string) => {
    setState({
      ...state,
      themeColor: color,
    });
  };

  const setName = (name: string) => {
    setState({
      ...state,
      name,
    });
  };

  const setUserHeadshot = (headshot?: string) => {
    setState({
      ...state,
      userHeadshot: headshot,
    });
  };

  const clearState = () => {
    setState(null);
  };

  return {
    name: state?.name,
    themeColor: state?.themeColor,
    userHeadshot: state?.userHeadshot,
    setThemeColor,
    setName,
    clearState,
    setUserHeadshot,
  };
};

export default useCustomizeCache;
