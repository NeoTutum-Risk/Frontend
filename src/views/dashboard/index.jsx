import { Main } from "./main";
import { SideNavigator } from "./sideNavigator";
import { CollapsePanel } from "./main/collapsePanel";
import styles from "./styles.module.scss";
import { useRecoilValue } from "recoil";
import { showAdminState } from "../../store/admin";
import AdminPanel from "../adminPanel";

export const Dashboard = () => {
  const showAdmin = useRecoilValue(showAdminState);

  return (
    <div className={styles.container}>
      <SideNavigator />
      {showAdmin ? (
        <AdminPanel />
      ) : (
        <>
          <Main />
          <CollapsePanel />
        </>
      )}
    </div>
  );
};
