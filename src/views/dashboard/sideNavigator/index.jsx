import { H3, H4, Button } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { useState } from "react";
import { Async } from "../../../components/asyncHOC";
import styles from "../styles.module.scss";
import { AddPortfolio } from "./addPortfolio";
import { AddReferenceGroup } from "./addRefrenceGroup";
import { ReferenceGroups } from "./referenceGroups";
import { Portfolios } from "./portfolios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../../store/user";

export const SideNavigator = () => {
  const [menuOpen, setMenuOpen] = useState(true);

  const user = useRecoilValue(userState);

  const navigate = useNavigate();
  return (
    <div
      style={menuOpen ? { minWidth: "250px" } : {}}
      className={`${styles.sideNavigatorContainer} bp3-dark`}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Tooltip2
          content={<span>{menuOpen ? "Collapse Menu" : "Expand Menu"}</span>}
        >
          <Button
            icon={menuOpen ? "menu-closed" : "menu-open"}
            small
            onClick={() => setMenuOpen((prev) => !prev)}
          />
        </Tooltip2>
        {(menuOpen && user === "SHA") && (
          <Tooltip2 content={<span>Admin Panel</span>}>
            <Button
              icon="person"
              small
              onClick={() => navigate("/admin-panel")}
            />
          </Tooltip2>
        )}

        {menuOpen && <H3 className={styles.userName}>user name</H3>}
      </div>

      {menuOpen && (
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
        </>
      )}
    </div>
  );
};
