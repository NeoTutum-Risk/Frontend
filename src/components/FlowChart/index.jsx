import { DataElement } from "./dataElement";
import { ConnetionContext } from "./connectionContext";
import { useRef, useEffect, useCallback, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getDataObjectConnections } from "../../services";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import {
  addNewElementsConnection,
  removeNewElementsConnection,
} from "../../services";
export const FlowChart = ({ graph, dataObjectId }) => {
  const [selectedElements, setSelectedElements] = useState([]);

  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  const [edges, setEdges] = useState([]);

  const getEdges = useCallback(async () => {
    const response = await getDataObjectConnections();
    setEdges(response.data.data);
    // console.log(response.data.data);
  }, []);

  useEffect(() => {
    getEdges();
  }, [getEdges]);

  const contextAction = useCallback(
    async (option) => {
      console.log(option, selectedElements);
      if (option === "Connect") {
        const payload = {
          sourceId:
            selectedElements[0].level_value < selectedElements[1].level_value
              ? selectedElements[0].id
              : selectedElements[1].id,
          targetId:
            selectedElements[1].level_value > selectedElements[0].level_value
              ? selectedElements[1].id
              : selectedElements[0].id,
        };
        const response = await addNewElementsConnection(payload);
        // if(response.status===200){
        console.log("new connection", response.data.data);
        setEdges((prev) => [...prev, response.data.data]);
        // setSelectedElements([]);
        // }
        // console.log(response);
      } else if (option === "Disconnect") {
        const sourceId =
          selectedElements[0].level_value < selectedElements[1].level_value
            ? selectedElements[0].id
            : selectedElements[1].id;
        const targetId =
          selectedElements[1].level_value > selectedElements[0].level_value
            ? selectedElements[1].id
            : selectedElements[0].id;

        const connection = edges.find(
          (edges) => edges.sourceId === sourceId && edges.targetId === targetId
        );
        const response = await removeNewElementsConnection({
          id: connection.id,
        });

        setEdges((prev) => prev.filter((edge) => edge.id !== connection.id));
        // setSelectedElements([]);
        console.log(connection, response);
      }
    },
    [selectedElements, edges]
  );

  const showContext = useCallback(
    (data) => {
      console.log("RCM", data);
      let option;
      console.log(
        "check",
        selectedElements,
        selectedElements.find((element) => element.id === data.id)
      );
      if (selectedElements.find((element) => element.id === data.id)) {
        if (selectedElements.length === 2) {
          if (
            Math.abs(
              selectedElements[0].level_value - selectedElements[1].level_value
            ) === 1
          ) {
            const sourceId =
              selectedElements[0].level_value < selectedElements[1].level_value
                ? selectedElements[0].id
                : selectedElements[1].id;
            const targetId =
              selectedElements[1].level_value > selectedElements[0].level_value
                ? selectedElements[1].id
                : selectedElements[0].id;

            // console.log("A7A Check",selectedElements,sourceId,targetId)
            if (
              edges.find(
                (edges) =>
                  edges.sourceId === sourceId && edges.targetId === targetId
              )
            ) {
              option = "Disconnect";
            } else {
              console.log("Connect");
              option = "Connect";
            }
          } else {
            console.log("Invalid Connect");
            option = "Invalid Connection";
          }
        } else {
          console.log("Not Two");
          option = `Invalid Connection`;
        }
      } else {
        option = `Not Selected`;
      }

      setContextMenu({
        show: true,
        x: Number(data.x),
        y: Number(data.y),
        option: option,
        function: contextAction,
      });
    },
    [contextAction, selectedElements, edges]
  );

  const elementSelection = useCallback(
    (elementData, state) => {
      console.log(elementData, state);
      if (state) {
        console.log("selecting");
        setSelectedElements((prev) => {
          return [...new Set([...prev, elementData])];
        });
      } else {
        setSelectedElements((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
      }
    },
    [setSelectedElements]
  );

  const handleClick = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <Xwrapper>
      {edges.map((edge) => (
        <Xarrow
          path="smooth"
          curveness={0.2}
          strokeWidth={1}
          start={String(edge.sourceId)}
          end={String(edge.targetId)}
          SVGcanvasStyle={{ zIndex: -1000000 }}
        />
      ))}

      <svg viewBox="0 0 500 400" width={490} height={355} onClick={handleClick}>
        {graph.nodes.map((node) => (
          <DataElement
            data={node}
            elementSelection={elementSelection}
            showContext={showContext}
            activeStatus={
              selectedElements.find((element) => element.id === node.id)
                ? true
                : false
            }
          />
        ))}

        {contextMenu.show && <ConnetionContext data={contextMenu} />}
      </svg>
    </Xwrapper>
  );
};
