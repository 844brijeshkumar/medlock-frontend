import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./index.css";
import FallBack from "./components/fallBack";
import ThemeProvider from "./utils/ThemeProvider";
import { ToastProvider } from "./utils/ToastContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<FallBack />}>
    <ToastProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ToastProvider>
  </Suspense>,
);
