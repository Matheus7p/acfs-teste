import { createBrowserRouter, Navigate } from "react-router-dom";

import { DashboardPage } from "./pages/dashboard";
import { Home } from "./pages/home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard/:fileId",
    element: <DashboardPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
