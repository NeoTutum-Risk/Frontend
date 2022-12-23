import { Window } from "../window";
import "./styles.module.css";
import JupyterViewer from "react-jupyter-notebook";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "@blueprintjs/core";
import { useCallback } from "react";
export const NotebookWindow = ({
  window,
  onClose,
  onCollapse,
  onResotre,
  collapseState,
  onTypeChange,
}) => {
  const noteBookNodeRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const scrollPosSaved = localStorage.getItem(`NotebookScrollPos_${window.data.id}`)

    if (scrollPosSaved) {
      if (scrollPosSaved < 0) {
        noteBookNodeRef.current.scrollTop = Number(0)
      } else {
        noteBookNodeRef.current.scrollTop = Number(scrollPosSaved)
      }
    }

  }, [])

  const updateScrollPos = useCallback(
    (e) => {
      setScrollPosition(e.target.offsetTop)
      console.log(e.target.offsetTop);
    },
    [scrollPosition],
  )


  const saveScrollPos = useCallback(
    () => {
      localStorage.setItem(window.data?.id ? `NotebookScrollPos_${window.data.id}` : `NotebookScrollPos_${1}`, scrollPosition + 200);
    },
    [scrollPosition],
  )
  

  return (
    <Window
      window={window}
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onResotre}
      onTypeChange={onTypeChange}
      title={window.data.name}
      collapseState={collapseState}
      icon="th"
    >
      <Button
        fill={false}
        text={"Save Position"}
        icon="tick"
        onClick={saveScrollPos}
      />
      <div onMouseLeave={updateScrollPos} ref={noteBookNodeRef} style={{ overflowY: "auto", height: "100%" }}>
        <JupyterViewer rawIpynb={window.data.fileParsedJson} />
      </div>


    </Window>
  );
};
