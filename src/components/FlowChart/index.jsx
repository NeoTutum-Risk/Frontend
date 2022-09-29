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
import { editableValues, headerValues ,allAttributesName} from "./data/refElementStructure";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  getDataObjectConnections,
  getReferenceWindowSettings,
  updateReferenceWindowSettings,
} from "../../services";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { useRecoilState } from "recoil";
import { windowsState } from "../../store/windows";
import { DataObject } from "./dataObject";

import {
  addNewElementsConnection,
  removeNewElementsConnection,
  updateDataObjectElement,
} from "../../services";
import { ObjectsGroup } from "./objectsGroup";
export const FlowChart = ({
  objects,
  groups,
  connections,
  setGroups,
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
  dataObjectId,
  tempConnections,
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
  const [initialGlobalScale, initializeGlobalScale] = useState(true);
  const [loadingZoomSettings, setloadingZoomSettings] = useState(true);

  console.log("flow rerendered");
  const updateXarrow = useXarrow();
  //
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [nodes, setNodes] = useState(objects);
  // const [nodes,setNodes] = useState()
  const [edges, setEdges] = useState([]);

  const getWindowSettings = useCallback(async () => {
    setloadingZoomSettings(true);
    const res = await getReferenceWindowSettings(dataObjectId);

    const { id, positionX, positionY, previousScale, scale } = res.data.data;
    setRASettings({
      id,
      positionX,
      positionY,
      scale,
      previousScale,
    });
  }, [dataObjectId]);

  useEffect(() => {
    getWindowSettings().then(() => {
      setloadingZoomSettings(false);
    });
  }, [dataObjectId, enviroDimension, getCenter, getWindowSettings]);

  const updateRAWindowSettings = async () => {
    console.log("beforeupdate", raSettings);

    await updateReferenceWindowSettings(dataObjectId, raSettings);

    console.log("RA Setting Updated updated");
  };

  (() => {
    if (initialGlobalScale) {
      console.log("Setting Initial Global Scale");
      setTimeout(() => {
        setGlobalScale(raSettings.scale);
        initializeGlobalScale(false);
      }, 500);
    }
  })();

  // const getEdges = useCallback(async () => {
  //   const response = await getDataObjectConnections();
  //   setEdges(response.data.data);
  // }, []);

  const transformWrapperRef = useRef(null);

  // useEffect(() => {
  //   getEdges();
  // }, [getEdges]);

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
        console.log("new connection", response.data.data);
        setEdges((prev) => [...prev, response.data.data]);
        setSelectedElements([]);
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

        setSelectedElements([]);
        console.log(connection, response);
        // onNetworkChange({ sourceId, targetId, option: "disconnect" });
      }
    },
    [selectedElements, edges,setSelectedElements]
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

  const handleZoomPanPinch = useCallback(
    (ref, e) => {
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
    },
    [updateXarrow,raSettings.id]
  );

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

  const checkConnection = useCallback(
    (id) => {
      let o=String(`RF-D-${id}`);
      groups
        .filter((grp) => !grp.expanded)
        .forEach((grp) => {
          if (grp.elements.find((element) => element.id === id))
            o= String(`group-object-${grp.id}`);
        });
        console.log(o)
      return o;
    },
    [groups]
  );
  if (loadingZoomSettings || initialGlobalScale) {
    return "";
  } else {
    return (
      <Xwrapper>
        {connections.map((edge) => (
          <Xarrow
            key={`con
              ${edge.sourceId}
              ${edge.targetId}`}
            path="smooth"
            curveness={0.2}
            strokeWidth={1}
            start={checkConnection(edge.sourceId)}
            end={checkConnection(edge.targetId)}
            SVGcanvasStyle={{ overflow: "hidden" }}
          />
        ))}
        {tempConnections.map((edge) => (
          <Xarrow
            path="smooth"
            curveness={0.2}
            strokeWidth={1}
            start={String(`RF-D-${edge.sourceId}`)}
            end={String(`RF-D-${edge.targetId}`)}
            SVGcanvasStyle={{ overflow: "hidden" }}
            lineColor={"yellow"}
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
                  {objects.map((node,index) => (
                    node?.id && 
                    <DataObject
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
                      key={`rf-${node.id}-g`}
                      enviroDimension={enviroDimension}
                      shared={0}
                      rootCall={rootCall}
                      editableValues={editableValues}
                      headerValues={headerValues}
                      allAttributesName={allAttributesName}
                    />
                  ))}
                  {groups.map((group) => (
                    <>
                      <ObjectsGroup
                        key={`group-${group.id}`}
                        data={group}
                        rootCall={rootCall}
                        scale={globalScale}
                        updateXarrow={updateXarrow}
                        enviroDimension={enviroDimension}
                        setGroups={setGroups}
                      />
                      {group.expanded &&
                        group.elements.map((node) => (
                          <DataObject
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
                            editableValues={editableValues}
                            headerValues={headerValues}
                            allAttributesName={allAttributesName}
                          />
                        ))}
                    </>
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
  }
};
