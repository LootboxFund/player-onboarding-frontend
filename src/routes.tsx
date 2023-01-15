import { createBrowserRouter } from "react-router-dom";
import { RoutesFE } from "./routes.types";

// pages
import ChooseImage from "./pages/ChooseImage";
import CustomizeLootboxName from "./pages/Customize/LootboxName";
import CustomizeLootboxThemeColor from "./pages/Customize/LootboxThemeColor";
import CustomizePlayerEmail from "./pages/Customize/PlayerEmail";

const router = createBrowserRouter([
  {
    path: RoutesFE.Home,
    element: <ChooseImage />,
  },
  {
    path: RoutesFE.CustomizeName,
    element: <CustomizeLootboxName />,
  },
  {
    path: RoutesFE.CustomizeThemeColor,
    element: <CustomizeLootboxThemeColor />,
  },
  {
    path: RoutesFE.CustomizePlayerEmail,
    element: <CustomizePlayerEmail />,
  },
]);

export default router;
