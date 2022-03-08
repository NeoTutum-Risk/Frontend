import { Card } from "@blueprintjs/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Admin Panel</h1>
        <div>
          <Card interactive={true} onClick={() => navigate("/meta-data")}>
            <h1>Meta Data</h1>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
