import { createBrowserRouter } from "react-router-dom";
import { RoutesFE } from "./routes.types";

// pages
import ChooseImage from "./pages/ChooseImage";
import CustomizeLootboxName from "./pages/Customize/LootboxName";
import CustomizeLootboxThemeColor from "./pages/Customize/LootboxThemeColor";
import CustomizePlayerEmail from "./pages/Customize/PlayerEmail";
import CustomizePlayerSelfie from "./pages/Customize/PlayerSelfie";
import ShareLootbox from "./pages/ShareLootbox";
import CustomizeFinish from "./pages/Customize/CreateLootbox";

// Auth guard
import RequireAuth from "./components/RequireAuth";

const router = createBrowserRouter(
  [
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
    {
      path: RoutesFE.CustomizePlayerHeadshot,
      element: (
        <RequireAuth
          redirectTo={RoutesFE.CustomizePlayerEmail}
          children={<CustomizePlayerSelfie />}
        />
      ),
    },
    {
      path: RoutesFE.CustomizeFinish,
      element: (
        <RequireAuth
          redirectTo={RoutesFE.CustomizePlayerEmail}
          children={<CustomizeFinish />}
        />
      ),
    },
    {
      path: RoutesFE.ShareLootbox,
      element: (
        <RequireAuth
          redirectTo={RoutesFE.CustomizePlayerEmail}
          children={<ShareLootbox />}
        />
      ),
    },
  ],
  {
    basename: "/play", // This app gets served at go.lootbox.fund/play/** */
  }
);

export default router;
