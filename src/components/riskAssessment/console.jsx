import { Button, ButtonGroup } from "@blueprintjs/core";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

export const Console = ({ logs }) => {
  const [logsIndex, setLogsIndex] = useState((logs.length - 1) | 0);
  useEffect(()=>{
    setLogsIndex((logs.length - 1))
  },[logs])

  const buttonAction = useCallback((action)=>{
    if(action==="forward"){
      if(logs.length-logsIndex>1)setLogsIndex(prev=>(prev+1))
    }else{
      if(logsIndex>0)setLogsIndex(prev=>(prev-1))
    }
  },[logs.length,logsIndex])
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
      <span>{logs.length > 0 ? logs[logsIndex]?.msg : "No Logs Yet"}</span>
      <ButtonGroup>
        <Button icon="arrow-left" onClick={()=>buttonAction("forward")} small={true}/>
        <Button icon="arrow-right" onClick={()=>buttonAction("backward")} small={true}/>
      </ButtonGroup>
    </div>
  );
};
