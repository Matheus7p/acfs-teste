import { createBrowserRouter, Navigate } from "react-router-dom";

import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard/:fileId",
    element: <div>logo logo</div>,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
