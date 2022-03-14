import { DataElement } from "./dataElement";
import { ConnetionContext } from "./connectionContext";
import { useRef, useEffect, useCallback, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getDataObjectConnections } from "../../services";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { useRecoilState, useSetRecoilState } from "recoil";
import { windowsState } from "../../store/windows";
import {
  addNewElementsConnection,
  removeNewElementsConnection,
  getDataObjectElement,
  getDataObject
} from "../../services";
import { setWith } from "lodash";
export const FlowChart = ({ graph, onNetworkChange, dataObjectId }) => {
  const updateXarrow = useXarrow();
  const [selectedElements, setSelectedElements] = useState([]);
  const [windows, setWindows] = useRecoilState(windowsState);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [nodes,setNodes]= useState([]);

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
        const sourceElement =
          selectedElements[0].level_value < selectedElements[1].level_value
            ? selectedElements[0]
            : selectedElements[1];

        const targetElement =
          selectedElements[1].level_value > selectedElements[0].level_value
            ? selectedElements[1]
            : selectedElements[0];
        const payload = {
          sourceId: sourceElement.id,
          targetId: targetElement.id,
        };
        const response = await addNewElementsConnection(payload);
        // if(response.status===200){
        // onNetworkChange({
        //   sourceId: sourceElement,
        //   targetId: targetElement,
        //   option: "connect",
        // });
        const changedElement = await getDataObjectElement(sourceElement.id);
        const dataObject = await getDataObject(dataObjectId);
        setWindows((prev) => {
          return prev.map((window) => {
            if (window.data.levelDataObject === dataObjectId && window.type==="data") {
              return {
                ...window,
                data: {
                  ...window.data,
                  levelData: window.data.levelData.map((element) => {
                    if (element.id === sourceElement.id) {
                      return { ...element, ConnectedTo: changedElement.data.data.dataObjectConnections.reduce((con, acc) => {
                        const returned = (con += ` ${
                          dataObject.data.data.dataObjectLevels
                            .flat()
                            .map((level) => level.dataObjectElements)
                            .flat()
                            .find((item) => item.id === acc.targetId).label
                        }`);
                        console.log("reduce", returned);
                        return returned;
                      }, "") };
                    } else {
                      return element;
                    }
                  }),
                },
              };
            } else {
              return window;
            }
          });
        });
        console.log("new connection", response.data.data);
        setEdges((prev) => [...prev, response.data.data]);
        setSelectedElements([]);

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
        const changedElement = await getDataObjectElement(sourceId);
        const dataObject = await getDataObject(dataObjectId);
        setWindows((prev) => {
          return prev.map((window) => {
            if (window.data.levelDataObject === dataObjectId  && window.type==="data") {
              return {
                ...window,
                data: {
                  ...window.data,
                  levelData: window.data.levelData.map((element) => {
                    if (element.id === sourceId) {
                      return { ...element, ConnectedTo: changedElement.data.data.dataObjectConnections.reduce((con, acc) => {
                        const returned = (con += ` ${
                          dataObject.data.data.dataObjectLevels
                            .flat()
                            .map((level) => level.dataObjectElements)
                            .flat()
                            .find((item) => item.id === acc.targetId).label
                        }`);
                        console.log("reduce", returned);
                        return returned;
                      }, "") };
                    } else {
                      return element;
                    }
                  }),
                },
              };
            } else {
              return window;
            }
          });
        });
        setSelectedElements([]);
        console.log(connection, response);
        // onNetworkChange({ sourceId, targetId, option: "disconnect" });
      }
    },
    [selectedElements, edges,dataObjectId,setWindows]
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

  const handleZoomPanPinch = useCallback(() => {
    updateXarrow();
    setTimeout(updateXarrow, 0);
    setTimeout(updateXarrow, 100);
    setTimeout(updateXarrow, 300);
    setTimeout(updateXarrow, 500);
    console.log("ZOOMPANPINCH");
  }, [updateXarrow]);

  return (
    <Xwrapper>
      <TransformWrapper
        initialScale={0.5}
        minScale={0.5}
        maxScale={1.8}
        doubleClick={{ disabled: true }}
        onZoom={updateXarrow}
        onZoomStop={handleZoomPanPinch}
        onPinching={updateXarrow}
        onPinchingStop={handleZoomPanPinch}
        onPanning={updateXarrow}
        onPanningStop={handleZoomPanPinch}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "250%", height: "250%" }}
        >
          <svg width={"100%"} onClick={handleClick}>
            {graph.nodes.map((node) => (
              <DataElement
                data={node}
                elementSelection={elementSelection}
                showContext={showContext}
                selectedElements={selectedElements}
              />
            ))}

            {contextMenu.show && <ConnetionContext data={contextMenu} />}
          </svg>
        </TransformComponent>
        {edges.map((edge) => (
          <Xarrow
            path="smooth"
            curveness={0.2}
            strokeWidth={1}
            start={String(edge.sourceId)}
            end={String(edge.targetId)}
            SVGcanvasStyle={{ overflow: "hidden" }}
          />
        ))}
      </TransformWrapper>
    </Xwrapper>
  );
};
