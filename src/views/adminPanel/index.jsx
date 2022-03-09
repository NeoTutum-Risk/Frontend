import { Button, Card } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./AdminPanel.module.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.adminPanelContainer}>
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          <div>
            <Tooltip2 content={<span>Dashboard</span>}>
              <Button
                className={classes.btnStyle}
                icon="home"
                onClick={() => navigate("/dashboard")}
              />
            </Tooltip2>
          </div>
          <div className={classes.title}>
            <h1>Admin Panel</h1>
          </div>
          <div></div>
        </div>
      </div>

      <div className={classes.bodyContainer}>
        <Card className={classes.cardsContainer}>
          <Card
            className={classes.cardStyle}
            interactive={true}
            onClick={() => navigate("/meta-data")}
          >
            <h1>Risk Object Meta Data</h1>
          </Card>

          <Card className={classes.cardStyle} interactive={true}>
            <h1>Admin Option</h1>
          </Card>

          <Card className={classes.cardStyle} interactive={true}>
            <h1>Settings</h1>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
