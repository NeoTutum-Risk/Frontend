import { useRoutes } from "react-router-dom";
import AdminPanel from "../views/adminPanel";
import { Auth } from "../views/auth";
import D3Graphs from "../views/d3Graphs";
import { Dashboard } from "../views/dashboard";
import Lookup from "../views/lookup";
import MetaData from "../views/metaData";
import { NotFound } from "../views/notFound";
import DashboardCharts from "../views/dashboardCharts";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { fullScreenHandlerState } from "../store/fullScreen";

export const Routes = () => {
  const element = useRoutes(routes);

  const setFullScreenHandler = useSetRecoilState(fullScreenHandlerState);
  const handle = useFullScreenHandle();

  useEffect(() => {
    setFullScreenHandler(handle);
  }, []);

  return <FullScreen handle={handle}>{element}</FullScreen>;
};

const routes = [
  {
    element: <Auth />,
    path: "/",
  },
  {
    element: <Dashboard />,
    path: "dashboard",
  },
  {
    element: <D3Graphs />,
    path: "d3-graphs",
  },
  {
    element: <DashboardCharts />,
    path: "dashboard-charts",
  },
  { path: "*", element: <NotFound /> },
];
