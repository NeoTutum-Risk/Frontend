import React from "react";
import classes from "./AdminPanel.module.css";
import {useRecoilValue} from "recoil"
import { activeAdminPanelState } from "../../store/admin";
import MetaData from "../metaData";
import Lookup from "../lookup";
import { DataObject } from "../../components/dataObject";

const AdminPanel = () => {
  const activeAdminPanel = useRecoilValue(activeAdminPanelState)

  return (
    <div className={classes.adminPanelContainer}>
      {
        activeAdminPanel === "meta-data" && 
        <MetaData />
      }
      {
        activeAdminPanel === "look-up" &&
        <Lookup />
      }
      {
        activeAdminPanel === "Data Objects" &&
        <DataObject />
      }
    </div>
  );
};

export default AdminPanel;
