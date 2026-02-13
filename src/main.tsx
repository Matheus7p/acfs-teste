import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { SupabaseProvider } from "@/context/supabase.context";

import { router } from "./route";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <RouterProvider router={router} />
    </SupabaseProvider>
  </React.StrictMode>,
);
