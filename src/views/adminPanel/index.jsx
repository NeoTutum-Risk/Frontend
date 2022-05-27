import React from "react";
import classes from "./AdminPanel.module.css";
import {useRecoilValue} from "recoil"
import { activeDashboardPanelState } from "../../store/dashboard";
import MetaData from "../metaData";
import Lookup from "../lookup";
import { DataObject } from "../../components/dataObject";

const AdminPanel = () => {
  const activeDashboardPanel = useRecoilValue(activeDashboardPanelState)

  return (
    <div className={classes.adminPanelContainer}>
      {
        activeDashboardPanel === "meta-data" && 
        <MetaData />
      }
      {
        activeDashboardPanel === "look-up" &&
        <Lookup />
      }
      {
        activeDashboardPanel === "Data Objects" &&
        <DataObject />
      }
    </div>
  );
};

export default AdminPanel;
