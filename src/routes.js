import { useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import ContainerWithDrawer from "./layouts/ContainerWithDrawer";
import Home from "./pages/Home";

export default function Router(props) {
  const [isDrawerOpened, setDrawerOpened] = useState(false);

  return useRoutes([
    {
      path: "/",

      element: (
        <ContainerWithDrawer
          isOpened={isDrawerOpened}
          setIsOpened={setDrawerOpened}
        />
      ),
      children: [
        { path: "/", element: <Navigate to="/home" replace /> },
        {
          path: "home",
          element: <Home setIsOpened={setDrawerOpened} />,
        },
      ],
    },
  ]);
}
