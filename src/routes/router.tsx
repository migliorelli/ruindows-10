import { createBrowserRouter } from "react-router-dom";
import LoginRoute from "./LoginRoute";
import AppRoute from "./AppRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRoute />,
  },
  {
    path: "/:username",
    element: <AppRoute />,
  },
]);

export default router;
