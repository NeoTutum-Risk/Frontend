import React from "react";
import classes from "./AdminPanel.module.css";
import {useRecoilValue} from "recoil"
import { activeDashboardPanelState } from "../../store/dashboard";
import MetaData from "../metaData";
import Lookup from "../lookup";
import { DataObject } from "../../components/dataObject";
import JSONProcessStep1Test from "../../components/JSONProcessStep1Test";
import AnalysisPackRunFiles from "../analysis-packs-run-files";

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
      },
      {
        activeDashboardPanel === "Analysis Packs Run Files" &&
        <AnalysisPackRunFiles />
      }
    </div>
  );
};

export default AdminPanel;
