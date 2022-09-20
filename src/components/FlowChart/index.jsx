import { DataElement } from "./dataElement";
import { Button, TextArea } from "@blueprintjs/core";
import { ConnetionContext } from "./connectionContext";
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { getDataObjectConnections, getReferenceWindowSettings, updateReferenceWindowSettings } from "../../services";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { useRecoilState } from "recoil";
import { windowsState } from "../../store/windows";
import { DataObject } from "./dataObject";

import {
  addNewElementsConnection,
  removeNewElementsConnection,
  updateDataObjectElement,
} from "../../services";
export const FlowChart = ({
  objects,
  groups,
  connections,
  handleContextMenu,
  setFirstContext,
  setHoveredElement,
  handleObjectAction,
  removeFromGroup,
  addToGroup,
  rootCall,
  selectedElements,
  setSelectedElements,
  globalViewIndex,
  views,
  dataObjectId
}) => {
  // console.log(`nodes`,graph.nodes)
  const [enviroDimension, setEnviroDimension] = useState({
    height: 50000,
    width: 50000,
  });


  const getCenter = useCallback(() => {
    let objectsArray = [...objects];
    let top = enviroDimension.height;
    let left = enviroDimension.width;
    let right = 0,
      bottom = 0;
    // groups.forEach((grp) => {
    //   if (grp.elements.length > 1) {
    //     objectsArray = [...objectsArray, ...grp.elements];
    //   }
    // });

    objectsArray.forEach((obj) => {
      if (obj !== null) {
        top = obj.y < top ? obj.y : top;
        left = obj.x < left ? obj.x : left;
        bottom = obj.y > bottom ? obj.y : bottom;
        right = obj.x > right ? obj.x : right;
      }
    });

    return { x: (right - left) / 2 + left, y: (bottom - top) / 2 + top };
  }, [enviroDimension, objects /* groups*/]);

  const [raSettings, setRASettings] = useState({
    id: 0,
    positionX: -Math.floor(getCenter().x),
    positionY: -Math.floor(getCenter().y),
    previousScale: 1,
    scale: 1,
  });
  const [globalScale, setGlobalScale] = useState(1);
  const [initialGlobalScale, initializeGlobalScale] = useState(true)
  const [loadingZoomSettings, setloadingZoomSettings] = useState(true);

  console.log("flow rerendered");
  const updateXarrow = useXarrow();
  //
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [nodes, setNodes] = useState(objects);
  // const [nodes,setNodes] = useState()
  const [edges, setEdges] = useState([]);

  
  const getWindowSettings = async () => {
    setloadingZoomSettings(true)
    const res = await getReferenceWindowSettings(dataObjectId);

    const { id, positionX, positionY, previousScale, scale } = res.data.data;
    setRASettings({
      id,
      positionX,
      positionY,
      scale,
      previousScale,
    });
  };

  useEffect(() => {
    getWindowSettings().then(() => {
      setloadingZoomSettings(false);
    });
  }, [dataObjectId, enviroDimension, getCenter]);

  const updateRAWindowSettings = async () => {
    console.log('beforeupdate', raSettings);

    await updateReferenceWindowSettings(dataObjectId, raSettings);

    console.log("RA Setting Updated updated");
  };

  (() => {
    if (initialGlobalScale) {
      console.log('Setting Initial Global Scale');
      setTimeout(() => {
        setGlobalScale(raSettings.scale)
        initializeGlobalScale(false)
      }, 500);
    }
})()



  const getEdges = useCallback(async () => {
    const response = await getDataObjectConnections();
    setEdges(response.data.data);
  }, []);

  const transformWrapperRef = useRef(null);

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

        /* const changedElement = await getDataObjectElement(sourceElement.id);
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
        });*/
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

        /*const changedElement = await getDataObjectElement(sourceId);
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
        });*/
        setSelectedElements([]);
        console.log(connection, response);
        // onNetworkChange({ sourceId, targetId, option: "disconnect" });
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

  const handleZoomPanPinch = useCallback((ref, e) => {
    const raState = ref.state;
    setRASettings({
      id: raSettings.id,
      positionX: raState.positionX,
      positionY: raState.positionY,
      scale: raState.scale,
      previousScale: raState.previousScale,
    });
    setGlobalScale(raState.scale < 0.1 ? 0.1 : raState.scale);

    updateXarrow();
    // setTimeout(updateXarrow, 0);
    setTimeout(updateXarrow, 100);
    setTimeout(updateXarrow, 400);
    // setTimeout(updateXarrow, 500);
    console.log("ZOOMPANPINCH");
  }, [updateXarrow]);

  const updateAndDeselect = useCallback(() => {
    let updatableElement, updateElementPosition;
    selectedElements.forEach(async (element) => {
      updatableElement = nodes.find((item) => item.id === element.id);
      updateElementPosition = await updateDataObjectElement(
        updatableElement.id,
        {
          x: updatableElement.x,
          y: updatableElement.y,
        }
      );
    });

    setSelectedElements([]);
  }, [selectedElements, nodes, setSelectedElements]);

  if (loadingZoomSettings || initialGlobalScale) {
    return "";
  } else {
  return (
    <Xwrapper>
      {connections.map((edge) => (
        <Xarrow
          path="smooth"
          curveness={0.2}
          strokeWidth={1}
          start={String(`RF-D-${edge.sourceId}`)}
          end={String(`RF-D-${edge.targetId}`)}
          SVGcanvasStyle={{ overflow: "hidden" }}
        />
      ))}

      <TransformWrapper
        zoomAnimation={{ disabled: true }}
        initialScale={raSettings.scale}
        initialPositionX={raSettings.positionX}
        initialPositionY={raSettings.positionY}
        minScale={0.1}
        maxScale={5}
        doubleClick={{ disabled: true }}
        onZoom={(ref, e) => {
          console.log(e);
          if (ref.state.scale < 0.1) {
            ref.state.scale = 0.1;
            e.zoomOut(0.1);
          }
          setGlobalScale(ref.state.scale < 0.1 ? 0.1 : ref.state.scale);
          updateXarrow();
        }}
        onZoomStop={(ref, e) => {
          handleZoomPanPinch(ref, e);
          setGlobalScale(ref.state.scale < 0.1 ? 0.1 : ref.state.scale);
          // setGlobalScale(ref.state.scale);
          // console.log("event zoom1", e);
          console.log("event zoom1", ref);

          // console.log("offsetX", e.offsetX);
          // console.log("offsetY", e.offsetY);
          // setRASettings({
          //   positionX: e.offsetX * -1,
          //   positionY: e.offsetY * -1,
          //   scale: ref.state.scale,
          // });
        }}
        onPinching={updateXarrow}
        onPinchingStop={handleZoomPanPinch}
        onPanning={updateXarrow}
        onPanningStop={handleZoomPanPinch}
        panning={{
          excluded: ["panningDisabled"],
          activationKeys: ["Control"],
        }}
        pinch={{ excluded: ["pinchDisabled"] }}
        wheel={{
          excluded: ["wheelDisabled"],
          step: 0.2,
        }}
        ref={transformWrapperRef}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform, ...rest }) => (
          <React.Fragment>
            <div
              style={{
                display: "inline",
                position: "absolute",
                zIndex: "99",
              }}
            >
              <Button
                small={true}
                fill={false}
                icon="plus"
                onClick={(e) => {
                  zoomIn();
                  setGlobalScale((prev) => (prev += 0.2));
                }}
              />
              <Button
                small={true}
                fill={false}
                icon="minus"
                onClick={() => {
                  zoomOut();
                  setGlobalScale((prev) => (prev -= 0.2));
                }}
              />
              <Button
                small={true}
                fill={false}
                icon="reset"
                onClick={() => {
                  setRASettings({
                    id: 0,
                    positionX: -Math.floor(getCenter().x),
                    positionY: -Math.floor(getCenter().y),
                    scale: 1,
                    previousScale: 1,
                  });
                  setTransform(
                    -Math.floor(getCenter().x),
                    -Math.floor(getCenter().y),
                    1
                  );

                  setGlobalScale(1);
                }}
              />
                <Button
                  small={true}
                  fill={false}
                  icon="tick"
                  onClick={updateRAWindowSettings}
                />
            </div>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
              contentStyle={{
                width: `${enviroDimension.width}px`,
                height: `${enviroDimension.height}px`,
                // backgroundColor: "white",
              }}
            >
              <div
                style={{
                  overflow: "auto",
                  height: `${enviroDimension.height}px`,
                  width: `${enviroDimension.width}px`,
                  position: "relative",
                  border: "5px solid grey",
                }}
                onScroll={updateXarrow}
                onContextMenu={(e) => {
                  // console.log(e);
                  rootCall("context", { e, type: "mainContextMenu" });
                }}
                onClick={() => rootCall("resetContext")}
              >
                {objects.map((node) => (
                  <DataObject
                    // groups={groups.map((grp) => ({
                    //   id: grp.id,
                    //   name: grp.name,
                    // }))}

                    globalViewIndex={globalViewIndex}
                    views={views}
                    handleContextMenu={handleContextMenu}
                    scale={globalScale}
                    expanded={true}
                    data={node}
                    selectedElements={selectedElements}
                    elementSelection={elementSelection}
                    setFirstContext={setFirstContext}
                    setHoveredElement={setHoveredElement}
                    handleObjectAction={handleObjectAction}
                    removeFromGroup={removeFromGroup}
                    addToGroup={addToGroup}
                    key={`rf-${node.id}`}
                    enviroDimension={enviroDimension}
                    shared={0}
                    rootCall={rootCall}
                    editableValues={[
                      {
                        name: "description",
                        title: "Description",
                        abbr: "Desc",
                        label: true,
                      },
                      {
                        name: "Type",
                        title: "Type",
                        abbr: "Type",
                        label: true,
                      },
                      {
                        name: "Scalar",
                        title: "Scalar",
                        abbr: "Scalar",
                        label: true,
                      },
                      {
                        name: "name",
                        title: "Name",
                        abbr: "Name",
                        label: true,
                      },
                    ]}
                    headerValues={[
                      {
                        name: "label",
                        title: "Label",
                        abbr: "Label",
                        editable: true,
                        label: false,
                      },
                      {
                        name: "levelValue",
                        title: "Level",
                        abbr: "Level",
                        editable: false,
                        label: true,
                      },
                      {
                        name: "",
                        title: "REF",
                        abbr: "",
                        editable: false,
                        label: true,
                      },
                    ]}
                  />
                ))}

                {contextMenu.show && (
                  <ConnetionContext
                    data={contextMenu}
                    updateAndDeselect={updateAndDeselect}
                  />
                )}
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Xwrapper>
  );
};
}