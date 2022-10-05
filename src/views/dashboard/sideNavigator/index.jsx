import { H3, H4, Button, Dialog } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { useState } from "react";
import { Async } from "../../../components/asyncHOC";
import styles from "../styles.module.scss";
import { AddPortfolio } from "./addPortfolio";
import { AddReferenceGroup } from "./addRefrenceGroup";
import { ReferenceGroups } from "./referenceGroups";
import { Portfolios } from "./portfolios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../../store/user";
import AdminSidebar from "./adminSidebar";
import {
  activeDashboardPanelState,
  showDashboardState,
} from "../../../store/dashboard";
import { emptyDatabase } from "../../../services";
import { showDangerToaster, showSuccessToaster } from "../../../utils/toaster";
import ConfirmDelete from "../../../components/confirmDelete";
import ChartsSidebar from "./chartsSidebar";
import { fullScreenHandlerState } from "../../../store/fullScreen";

export const SideNavigator = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const user = useRecoilValue(userState);
  const [showDashboard, setShowDashboard] = useRecoilState(showDashboardState);
  const setActiveDashboardPanel = useSetRecoilState(activeDashboardPanelState);
  const fullScreenHandler = useRecoilValue(fullScreenHandlerState);

  /**
   * handles the open of the dialog for confirmation of emptying database
   */
  const openDialogHandler = () => {
    setOpenDialog(true);
  };

  /**
   * handler that triggers the empty database in the backend on click
   */
  const emptyDatabaseHandler = async () => {
    try {
      const res = await emptyDatabase();

      if (res.status === 201) {
        showSuccessToaster("database have been successfully emptied");
      } else {
        showDangerToaster("there was an error");
      }
    } catch (err) {
      showDangerToaster(err.message);
    }
  };

  /**
   * handle on-click of the cancel dialog button
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  /**
   * handle the confirmation of the confirm dialog button
   */
  const handleConfirm = () => {
    emptyDatabaseHandler();
    handleCloseDialog();
  };

  /**
   * handle admin open
   */
  const handleAdminOpen = () => {
    setShowDashboard("admin");
    setActiveDashboardPanel(null);
  };

  const handleFullScreen = (e) => {
    if (!isFullScreen) fullScreenHandler.enter(e);
    else fullScreenHandler.exit(e);

    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      style={menuOpen ? { minWidth: "250px" } : {}}
      className={`${styles.sideNavigatorContainer} bp3-dark`}
    >
      <Dialog shouldReturnFocusOnClose={false} isOpen={openDialog}>
        <ConfirmDelete
          handleCloseDialog={handleCloseDialog}
          handleConfirm={handleConfirm}
        />
      </Dialog>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: menuOpen ? "row" : "column",
          gap: showDashboard === "admin" ? "10px" : "20px",
          position: "sticky",
          top: "0px",
          backgroundColor: "#293742",
          paddingBottom: "10px",
          paddingTop: "10px",
          zIndex:"10000"
        }}
      >
        <Tooltip2
          content={<span>{menuOpen ? "Collapse Menu" : "Expand Menu"}</span>}
        >
          <Button
            icon={menuOpen ? "menu-closed" : "menu-open"}
            small
            onClick={() => setMenuOpen((prev) => !prev)}
          />
        </Tooltip2>
        {showDashboard !== "admin" && (
          <Tooltip2 content={<span>Admin Panel</span>}>
            <Button icon="person" small onClick={handleAdminOpen} />
          </Tooltip2>
        )}

        {menuOpen && showDashboard === "admin" && (
          <Tooltip2 content={<span>Dashboard</span>}>
            <Button
              icon="home"
              small
              onClick={() => setShowDashboard("default")}
            />
          </Tooltip2>
        )}

        {menuOpen && showDashboard === "admin" && (
          <Tooltip2 content={<span>Empty Database</span>}>
            <Button
              icon="trash"
              intent="danger"
              small
              onClick={openDialogHandler}
            />
          </Tooltip2>
        )}

        {/* {fullScreenHandler && (
          <Tooltip2 content={<span>{isFullScreen ? "Minimize" : "Full Screen"}</span>}>
            <Button icon="maximize" small onClick={handleFullScreen} />
          </Tooltip2>
        )} */}

        {menuOpen && (
          <H3 className={styles.userName}>
            {user === "Admin" ? "super user" : "normal user"}
          </H3>
        )}
      </div>

      {menuOpen && (
        <>
          {showDashboard !== "admin" && (
            <>
              <div className={styles.tree}>
                <div className={styles.addPortfolio}>
                  <H4>Reference Groups</H4>
                  <AddReferenceGroup />
                </div>
                <Async>
                  <ReferenceGroups />
                </Async>
              </div>
              <div className={styles.tree}>
                <div className={styles.addPortfolio}>
                  <H4>Portfolios</H4>
                  <AddPortfolio />
                </div>
                <Async>
                  <Portfolios />
                </Async>
              </div>
              <div className={styles.tree}>
                <div className={styles.addPortfolio}>
                  <H4>Dashboard Charts</H4>
                </div>
                <Async>
                  <ChartsSidebar />
                </Async>
              </div>
            </>
          )}
          {showDashboard === "admin" && (
            <div className={styles.tree}>
              <div className={styles.addPortfolio}>
                <H4>Admin</H4>
              </div>
              <AdminSidebar />
            </div>
          )}
        </>
      )}
    </div>
  );
};
