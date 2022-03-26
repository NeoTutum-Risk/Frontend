import { Button, Card } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import React from "react";
import { useNavigate } from "react-router-dom";
import { emptyDatabase } from "../../services";
import { showDangerToaster, showSuccessToaster } from "../../utils/toaster";
import classes from "./AdminPanel.module.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  // handler that triggers the empty database in the backend on click
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
          <div className={classes.emptyDatabase}>
            <Button
              className={classes.btnStyle}
              intent={"danger"}
              onClick={emptyDatabaseHandler}
            >
              Empty Database
            </Button>
          </div>
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

          <Card
            className={classes.cardStyle}
            interactive={true}
            onClick={() => navigate("/look-up")}
          >
            <h1>Look-up</h1>
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
