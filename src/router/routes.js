import { useRoutes } from "react-router-dom";
import AdminPanel from "../views/adminPanel";
import { Auth } from "../views/auth";
import D3Graphs from "../views/d3Graphs";
import { Dashboard } from "../views/dashboard";
import Lookup from "../views/lookup";
import MetaData from "../views/metaData";
import { NotFound } from "../views/notFound";
import SelectRiskAssessment from "../views/SelectRiskAssessment";

export const Routes = () => {
  const element = useRoutes(routes);
  return element;
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
    path: "d3-graphs"
  },
  {
    element: <SelectRiskAssessment />,
    path: "select-risk-assessment"
  },
  { path: "*", element: <NotFound /> },
];
