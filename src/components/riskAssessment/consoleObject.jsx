import { Button, ButtonGroup } from "@blueprintjs/core";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

export const Console = ({ logs }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "auto",
        backgroundColor: "black",
        justifyContent: "space-between",
        alignItems:"center",
        overflowY:"auto"
      }}
    >
      {logs.map((log,index)=><span key={`l-${index}`} style={{color:"lime"}}>{log.msg}</span>)}

      {/* <span>{logs.length > 0 ? logsIndex + 1 : 0}</span>
      <spann>{logs.length > 0 ? logs[logsIndex] : "No Logs Yet"}</spann> */}
      {/* <ButtonGroup>
        <Button icon="arrow-left" onClick={()=>buttonAction("forward")} small={true}/>
        <Button icon="arrow-right" onClick={()=>buttonAction("forward")} small={true}/>
      </ButtonGroup> */}
    </div>
  );
};
