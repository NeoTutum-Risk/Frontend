import { Window } from "../window";
import "./styles.module.css";
import JupyterViewer from "react-jupyter-notebook";
import { useEffect, useState, useRef } from "react";
import { Button } from "@blueprintjs/core";
import { useCallback } from "react";
import { getRiskAssessmentLogs } from "../../../../../services";
import {
  showDangerToaster,
  showSuccessToaster,
} from "../../../../../utils/toaster";
import {SOCKET_URI } from "../../../../../constants";
import { ConsoleObject } from "../../../../../components/riskAssessment/consoleObject";

import openSocket from "socket.io-client";
export const ConsoleWindow = ({
  window,
  onClose,
  onCollapse,
  onResotre,
  collapseState,
  onTypeChange,
}) => {
  const [logs, setLogs] = useState([]);

  const fetchRiskAssessmentLogs = useCallback(async () => {
    try {
      const response = await getRiskAssessmentLogs(window.data.riskAssessment);
      if (response?.status >= 200 && response?.status < 300) {
        setLogs(response.data.data);
      } else {
        showDangerToaster("Error Fetching NoteBook Data");
      }
    } catch (err) {
      showDangerToaster("Error Fetching NoteBook Data");
    }
  }, [window.data.riskAssessment]);

  useEffect(() => {
    fetchRiskAssessmentLogs();
  }, [window.data.id, fetchRiskAssessmentLogs]);

  const initialSocket = useCallback(() => {
    console.log('initial socket');
    const socket = openSocket(`${SOCKET_URI}`);
    socket.on(`analytics_progress_${window.data.riskAssessment}`, (log) => {
      setLogs(prev=>([log,...prev]))
      console.log(log)
    });
    return socket;
  }, [window.data.riskAssessment,]);

  useEffect(() => {
    const socketIO = initialSocket();
    return () => {
      if (socketIO) {
        console.log(`Socket disconnected -> ${window.data.riskAssessment}`);
        socketIO.disconnect()
      }
    };
  }, [initialSocket]);

  return (
    <Window
      window={window}
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onResotre}
      onTypeChange={onTypeChange}
      title={window.data.id}
      collapseState={collapseState}
      icon="th"
    >
      <ConsoleObject logs={logs}/>
    </Window>
  );
};
