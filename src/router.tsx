import { createBrowserRouter } from "react-router-dom";
import App from "./pages/App.tsx"; // ✅ Adicione a extensão

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/app",
    element: <App />,
  },
]);
