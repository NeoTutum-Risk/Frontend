import { Button, ButtonGroup } from "@blueprintjs/core";
import { useEffect } from "react";
import { useState } from "react";

export const Console = ({ logs }) => {
  const [logsIndex, setLogsIndex] = useState((logs.length - 1) | 0);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "auto",
        backgroundColor: "lightblue",
        justifyContent: "space-between",
        alignItems:"center"
      }}
    >
      <span>{logs.length > 0 ? logsIndex + 1 : 0}</span>
      <spann>{logs.length > 0 ? logs[logsIndex] : "No Logs Yet"}</spann>
      <ButtonGroup>
        <Button icon="arrow-left" small={true}/>
        <Button icon="arrow-right" small={true}/>
      </ButtonGroup>
    </div>
  );
};
