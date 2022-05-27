import { useRecoilValue } from "recoil"
import { activeDashboardPanelState } from "../../store/dashboard"
import DashboardCharts from "../dashboardCharts"
import classes from "./ChartPanel.module.css";

const ChartPanel = () => {

    const activeDashboardPanel = useRecoilValue(activeDashboardPanelState)
    
    return (
        <div className={classes.chartPanelContainer}>
        {
          activeDashboardPanel === "l0" && 
          <DashboardCharts />
        }
      </div>
    )
}

export default ChartPanel