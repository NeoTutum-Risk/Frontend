import { Main } from "./main";
import { SideNavigator } from "./sideNavigator";
import { CollapsePanel } from "./main/collapsePanel";
import styles from "./styles.module.scss";
import { useRecoilValue } from "recoil";
import { showDashboardState } from "../../store/dashboard";
import AdminPanel from "../adminPanel";
import DashboardCharts from "../dashboardCharts";
import ChartPanel from "../chartPanel";

export const Dashboard = () => {
  const showDashboard = useRecoilValue(showDashboardState);

  return (
    <div className={styles.container}>
      <SideNavigator />
      {showDashboard === "default" && (
        <>
          <Main />
          <CollapsePanel />
        </>
      )}

      {showDashboard === "admin" && <AdminPanel />}

      {showDashboard === "charts" && <ChartPanel />}
    </div>
  );
};
