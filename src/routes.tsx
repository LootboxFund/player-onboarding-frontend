import { createBrowserRouter } from "react-router-dom";
import { RoutesFE } from "./routes.types";

// pages
import ChooseImage from "./pages/ChooseImage";
import CustomizeLootboxName from "./pages/Customize/LootboxName";
import CustomizeLootboxThemeColor from "./pages/Customize/LootboxThemeColor";

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
]);

export default router;
