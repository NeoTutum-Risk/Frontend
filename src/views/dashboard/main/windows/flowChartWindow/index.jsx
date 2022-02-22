import { Intent, Spinner, Switch } from "@blueprintjs/core";
import { useCallback, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Bpmn } from "../../../../../components/bpmn";
import {
  addNewElementsConnection,
  getDataObjectConnections,
} from "../../../../../services";
import { platformState } from "../../../../../store/portfolios";
import { elementSelectorState } from "../../../../../store/elementSelector";
import { showDangerToaster } from "../../../../../utils/toaster";
import { Window } from "../window";
import { FlowChart } from "../../../../../components/FlowChart";
export const FlowChartWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [edges, setEdges] = useState([]);
  const preparedNodes = window.data.dataObjectLevels.map((level) => {
    return level.dataObjectElements.map((element) => {
      return {
        label: element.name,
        id: element.id,
        level_value: level.level_value,
      };
    });
  });

  const getEdges = useCallback(async () => {
    const response = await getDataObjectConnections();
    setEdges(response.data.data);
    console.log(response.data.data);
  },[]);

  useEffect(() => {
    getEdges();
  }, [getEdges]);
  // console.log(preparedNodes);
  const onNetworkChange = useCallback(async (data) => {
    const { sourceId, targetId, name } = data;
    if (!sourceId || !targetId) {
      console.log(data);
      return;
    }
    //if(edges.length===0)return;

    const response = await addNewElementsConnection(data);
    console.log("working on network", data);
  },[]);
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
      <FlowChart
        graph={{ nodes: preparedNodes.flat(), edges: edges }}
        onNetworkChange={onNetworkChange}
      />
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
