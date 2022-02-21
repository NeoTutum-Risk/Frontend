import { Intent, Spinner, Switch } from "@blueprintjs/core";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { Bpmn } from "../../../../../components/bpmn";
import { updateBpmnStatus } from "../../../../../services";
import {
  platformState,
} from "../../../../../store/portfolios";
import { elementSelectorState } from "../../../../../store/elementSelector";
import { showDangerToaster } from "../../../../../utils/toaster";
import { Window } from "../window";
import {FlowChart} from "../../../../../components/FlowChart";
export const FlowChartWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  return (
    <Window
      // title={window.data.fileName}
      windowID={window.id}
      icon="diagram-tree"
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onRestore}
      onTypeChange={onTypeChange}
      collapseState={collapseState}
      headerAdditionalContent={
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* <Switch
            checked={autoSave}
            style={{ marginBottom: 0 }}
            label="Auto Save"
            onChange={() => setAutoSave((prevAutoSave) => !prevAutoSave)}
          /> */}
          {/* {autoSaveLoading && <Spinner size={12} intent={Intent.PRIMARY} />} */}
        </div>
      }
    >
      <FlowChart graph={{nodes:window.data.dataObjectLevels.map(level=>{return {label:level.name,id:level.id}}),edges:[]}} onNetworkChange={data=>console.log(data)}/>
      {/* <Bpmn
        xml={bpmn.xml ?? window.data.fileData}
        onChange={(data) => {
          setbpmn({ xml: data, changed: !autoSave });
          if (autoSave) {
            saveBpmn(data);
          }
        }}
        onClick={(data) => elementSelectorHandler(data)}
      /> */}
    </Window>
  );
};
