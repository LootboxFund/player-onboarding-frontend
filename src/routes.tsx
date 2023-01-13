import { createBrowserRouter } from "react-router-dom";

// pages
import ChooseImage from "./pages/ChooseImage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChooseImage />,
  },
]);

export default router;
