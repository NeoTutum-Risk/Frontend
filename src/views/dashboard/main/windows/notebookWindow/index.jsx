import { Window } from "../window";
import "./styles.module.css";
import JupyterViewer from "react-jupyter-notebook";
import { useEffect, useState, useRef } from "react";
import { Button } from "@blueprintjs/core";
import { useCallback } from "react";
import { getNoteBook } from "../../../../../services";
import {
  showDangerToaster,
  showSuccessToaster,
} from "../../../../../utils/toaster";

const emptyNotebook = {
  cells: [],
  nbformat: 4,
  nbformat_minor: 4,
};

export const NotebookWindow = ({
  window,
  onClose,
  onCollapse,
  onResotre,
  collapseState,
  onTypeChange,
}) => {
  const noteBookNodeRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [noteBookJSON, setNoteBookJSON] = useState(emptyNotebook);

  const fetchNoteBookJSONData = useCallback(async () => {
    try {
      const response = await getNoteBook(window.data.id);
      if (response?.status >= 200 && response?.status < 300) {
        setNoteBookJSON(response.data.data.fileParsedJson);
      } else {
        showDangerToaster("Error Fetching NoteBook Data");
      }
    } catch (err) {
      showDangerToaster("Error Fetching NoteBook Data");
    }
  }, [window.data.id]);

  useEffect(() => {
    fetchNoteBookJSONData();
  }, [window.data.id, fetchNoteBookJSONData]);

  useEffect(() => {
    const scrollPosSaved = localStorage.getItem(
      `NotebookScrollPos_${window.data.id}`
    );

    const scrollPosSavedNum = Number(scrollPosSaved)

    if (scrollPosSavedNum) {
      if (scrollPosSavedNum < 0) {
        noteBookNodeRef.current.scrollTop = Number(0);
      } else {
        noteBookNodeRef.current.scrollTop = Number(scrollPosSavedNum);
      }
    }
  }, [noteBookJSON, window.data.id])


  const updateScrollPos = useCallback(
    (e) => {
      setScrollPosition(e.target.offsetTop);
    },
    []
  );

  const saveScrollPos = useCallback(() => {
    localStorage.setItem(
      window.data?.id
        ? `NotebookScrollPos_${window.data.id}`
        : `NotebookScrollPos_${1}`,
      scrollPosition + 200
    );
  }, [scrollPosition, window.data.id]);

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
      <div
        onMouseLeave={updateScrollPos}
        ref={noteBookNodeRef}
        style={{ overflowY: "auto", height: "100%" }}
      >
        {noteBookJSON && <JupyterViewer rawIpynb={noteBookJSON} />}
      </div>
    </Window>
  );
};
