import { useRoutes } from "react-router-dom";
import AdminPanel from "../views/adminPanel";
import { Auth } from "../views/auth";
import { Dashboard } from "../views/dashboard";
import Lookup from "../views/lookup";
import MetaData from "../views/metaData";
import { NotFound } from "../views/notFound";

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
  { path: "*", element: <NotFound /> },
];
