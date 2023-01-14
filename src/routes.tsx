import { createBrowserRouter } from "react-router-dom";
import { RoutesFE } from "./routes.types";

// pages
import ChooseImage from "./pages/ChooseImage";
import CustomizeTicket from "./pages/CustomizeTicket";

const router = createBrowserRouter([
  {
    path: RoutesFE.Home,
    element: <ChooseImage />,
  },
  {
    path: RoutesFE.Customize,
    element: <CustomizeTicket />,
  },
]);

export default router;
