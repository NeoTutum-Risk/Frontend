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
  console.log("Window Data",window.data);
  const preparedNodes = window.data.dataObjectLevels.map((level) => {
    return level.dataObjectElements.map((element) => {
      return {
        label: element.label,
        name: element.name,
        description: element.description,
        id: element.id,
        x:element.x,
        y:element.y,
        width:element.width,
        height:element.height,
        rank:element.rank,
        color:element.color,
        type:element.Type,
        scalar:element.Scalar,
        level_value: level.level_value,
        level_name: level.name,
        level_id: level.id,
        level:element.level,
        connections:element.dataObjectConnections
      };
    });
  });

  
  // console.log("pn",preparedNodes);
  const getEdges = useCallback(async () => {
    const response = await getDataObjectConnections();
    setEdges(response.data.data.map(edge=>({from:edge.sourceId,to:edge.targetId})));
    // console.log(response.data.data);
  },[]);

  useEffect(() => {
    getEdges();
  }, [getEdges]);
  // console.log(preparedNodes);
  const onNetworkChange = useCallback(async (data) => {
    const { sourceId, targetId, option } = data;
    if (!sourceId || !targetId) {
      // console.log(data);
      return;
    }
    //if(edges.length===0)return;

    const response = await addNewElementsConnection(data);
    console.log("working on network", data);
  },[]);
  return (
    <Window
      // title={window.data.fileName}
      window={window}
      icon="diagram-tree"
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onRestore}
      onTypeChange={onTypeChange}
      collapseState={collapseState}
      title={window.data.metaDataLevel2.name}
    >
      <FlowChart
        graph={{ nodes: preparedNodes.flat(), edges: edges }}
        onNetworkChange={onNetworkChange}
        dataObjectId={window.data.id}

      />
    </Window>
  );
};
