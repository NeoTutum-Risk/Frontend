import { Button, ButtonGroup } from "@blueprintjs/core";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

export const ConsoleObject = ({ logs }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        // justifyContent: "space-between",
        alignItems:"start",
        overflowY:"auto",
        flexDirection:"column"
      }}
    >
      {logs.reverse().map((log,index)=><span key={`l-${index}`} style={{color:"lime"}}>{log.msg}</span>)}

      {/* <span>{logs.length > 0 ? logsIndex + 1 : 0}</span>
      <spann>{logs.length > 0 ? logs[logsIndex] : "No Logs Yet"}</spann> */}
      {/* <ButtonGroup>
        <Button icon="arrow-left" onClick={()=>buttonAction("forward")} small={true}/>
        <Button icon="arrow-right" onClick={()=>buttonAction("forward")} small={true}/>
      </ButtonGroup> */}
    </div>
  );
};
