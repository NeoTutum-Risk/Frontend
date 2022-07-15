import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";
import { Button, TextArea } from "@blueprintjs/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { RiskElement } from "./riskElement";
import { RiskGroup } from "./riskGroup";
import { useCallback, useState, Fragment, useRef } from "react";
import { objectSelectorState } from "../../store/objectSelector";
import { useRecoilState } from "recoil";
import { DataObject } from "./dataObject";
import React, { useEffect } from "react";
import {
  getRiskAssessmentWindowSettings,
  updateRiskAssessmentWindowSettings,
} from "../../services";
export const RiskAssessment = ({
  objects,
  groups,
  dataObjectInstances,
  riskAssessmentId,
  handleContextMenu,
  selectedElements,
  setSelectedElements,
  connections,
  instanceConnections,
  instanceObjectConnections,
  onContext,
  resetContext,
  setFirstContext,
  editRiskObject,
  closedFace,
  setHoveredElement,
  handleObjectAction,
  menu,
  handleProperties,
  removeFromGroup,
  addToGroup,
  checkFilter,
  checkConnctionVisibility,
  setGroups,
}) => {
  const transformWrapperRef = useRef(null);
  const enviroDimension = { height: 50000, width: 50000 };
  const [objectPropertyConnections, setObjectPropertyConnections] = useState(
    []
  );
  const [selectedObjects, setSelectedObjects] =
    useRecoilState(objectSelectorState);
  const [globalScale, setGlobalScale] = useState(1);
  const [raSettings, setRASettings] = useState({
    id: 0,
    positionX: -Math.floor(enviroDimension.width / 2),
    positionY: -Math.floor(enviroDimension.height / 2),
    previousScale: 1,
    scale: 1,
  });
  const [loadingZoomSettings, setloadingZoomSettings] = useState(true);

  useEffect(() => {
    const getWindowSettings = async () => {
      // const res = await getRiskAssessmentWindowSettings(riskAssessmentId);

      // const { id, positionX, positionY, previousScale, scale } = res.data.data;
      // console.log("state comming from database: ", res.data);

      // let reposition;
      // switch (scale) {
      //   case scale < 0.7:
      //     reposition = 500;
      //     break;
      //   default:
      //     reposition = 300;
      // }
      // const condX = positionX + reposition > 0 ? 0 : positionX + reposition;
      // const condY = positionY + reposition > 0 ? 0 : positionY + reposition;
      setRASettings({
        id: 0,
        positionX: -Math.floor(enviroDimension.width / 2),
        positionY: -Math.floor(enviroDimension.height / 2),
        scale: 1,
        previousScale: 1,
      });
    };
    getWindowSettings().then((res) => {
      setloadingZoomSettings(false);
    });

    // getRiskAssessmentWindowSettings(riskAssessmentId).then((res) => {
    //   const { id, positionX, positionY, previousScale, scale } = res.data.data;
    //   // transformWrapperRef.current.setTransform(positionX, positionY, scale)

    //   // setNewZoom()

    //   setRASettings({
    //     id,
    //     positionX,
    //     positionY,
    //     previousScale,
    //     scale,
    //   });

    //   setloadingZoomSettings(false);
    // });
  }, [riskAssessmentId]);

  useEffect(() => {
    if (raSettings.hasOwnProperty("id")) {
      return;
    }
    // console.log("RA Settings before update to the server: ", raSettings);

    // updateRiskAssessmentWindowSettings(riskAssessmentId, raSettings);
  }, [raSettings, riskAssessmentId]);

  const elementSelection = useCallback(
    (elementData, state) => {
      console.log(elementData, state);
      if (state) {
        console.log("selecting");
        setSelectedElements((prev) => {
          return [...new Set([...prev, elementData])];
        });
        setSelectedObjects((prev) => {
          return [...new Set([...prev, elementData])];
        });

        console.log("store", selectedObjects);
      } else {
        setSelectedElements((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
        setSelectedObjects((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
      }
    },
    [setSelectedElements, setSelectedObjects, selectedObjects]
  );

  const handleObjectProperty = useCallback(({ id, action }) => {
    if (action === "add") {
      setObjectPropertyConnections((prev) => [...prev, id]);
    } else {
      setObjectPropertyConnections((prev) => prev.filter((obj) => obj !== id));
    }
  }, []);
  const updateXarrow = useXarrow();
  const handleZoomPanPinch = useCallback(
    (ref, e) => {
      const raState = ref.state;
      // console.log("RA State before update settings:", raState);
      // setRASettings({ ...raState });
      setRASettings({
        positionX: e.offsetX * -1,
        positionY: e.offsetY * -1,
        scale: ref.state.scale,
        previousScale: ref.state.previousScale,
      });
      updateXarrow();
      setTimeout(updateXarrow, 0);
      setTimeout(updateXarrow, 100);
      setTimeout(updateXarrow, 300);
      setTimeout(updateXarrow, 500);
      console.log("ZOOMPANPINCH");
    },
    [updateXarrow]
  );

  // console.log("raSettingssssss", raSettings);

  if (loadingZoomSettings) {
    return "";
  } else {
    return (
      // <div
      //   style={{ overflow: "auto", height: "100%", width: "100%",position:"relative" }}
      //   onScroll={updateXarrow}
      //   onContextMenu={(e) => handleContextMenu(e, { from: "main" })}
      //   onClick={resetContext}
      // >

      <Xwrapper>
        {instanceConnections.map(
          (edge) =>
            checkConnctionVisibility(edge, "dataObjects") && (
              <Xarrow
                // zIndex={1000000}
                key={
                  riskAssessmentId + " " + edge.sourceRef + " " + edge.targetRef
                }
                path="straight"
                curveness={0.2}
                strokeWidth={1.5}
                color="#29A634"
                headColor="#29A634"
                tailColor="#29A634"
                lineColor="#29A634"
                showHead={
                  checkConnctionVisibility(edge, "dataObjects") ===
                  "collapsedGroup"
                    ? false
                    : checkConnctionVisibility(edge, "dataObjects")
                }

                labels={{
                  middle:
                    (checkConnctionVisibility(edge, "dataObjects") !==
                    "collapsed" &&  checkConnctionVisibility(edge, "dataObjects") !==
                    "collapsedGroup") ? (
                      <div style={{ display: !true ? "none" : "inline" }}>
                        {edge.name}
                      </div>
                    ) : (
                      ``
                    ),
                }}
                start={String("D-" + riskAssessmentId + "-" + edge.sourceRef)}
                end={String("D-" + riskAssessmentId + "-" + edge.targetRef)}
                SVGcanvasStyle={{ overflow: "hidden" }}
              />
            )
        )}

        {instanceObjectConnections.map(
          (edge) =>
            // console.log(String((edge.objectType==="Input"?"D-":"R-") + riskAssessmentId + "-" + edge.sourceRef))
            checkConnctionVisibility(edge, "riskDataObjects") && (
              <Xarrow
                // zIndex={1000000}
                key={
                  riskAssessmentId + " " + edge.sourceRef + " " + edge.targetRef
                }
                path="straight"
                curveness={0.2}
                strokeWidth={1.5}
                color="#29A634"
                headColor="#29A634"
                tailColor="#29A634"
                lineColor="#29A634"
                showHead={
                  checkConnctionVisibility(edge, "riskDataObjects") ===
                  "collapsedGroup"
                    ? false
                    : checkConnctionVisibility(edge, "riskDataObjects") 
                }

                labels={{
                  middle:
                    (checkConnctionVisibility(edge, "riskDataObjects") !==
                    "collapsed" && checkConnctionVisibility(edge, "riskDataObjects") !==
                    "collapsedGroup" )? (
                      <div style={{ display: !true ? "none" : "inline" }}>
                        {edge.name}
                      </div>
                    ) : (
                      ``
                    ),
                }}
                start={String(
                  (edge.objectType === "Input" ? "D-" : "R-") +
                    riskAssessmentId +
                    "-" +
                    edge.sourceRef
                )}
                end={String(
                  (edge.objectType === "Input" ? "R-" : "D-") +
                    riskAssessmentId +
                    "-" +
                    edge.targetRef
                )}
                SVGcanvasStyle={{ overflow: "hidden" }}
              />
            )
        )}

        {connections.map(
          (edge) =>
            checkConnctionVisibility(edge, "riskObjects") && (
              <Xarrow
                // zIndex={1000000}
                key={
                  riskAssessmentId + " " + edge.sourceRef + " " + edge.targetRef
                }
                path="straight"
                curveness={0.2}
                strokeWidth={1.5}
                showHead={
                  checkConnctionVisibility(edge, "riskObjects") ===
                  "collapsedGroup"
                    ? false
                    : checkConnctionVisibility(edge, "riskObjects")
                }
                // showTail={checkConnctionVisibility(edge, "riskObjects")==="collapsedGroup"?false:undefined}
                labels={{
                  middle:
                    (checkConnctionVisibility(edge, "riskObjects") !==
                    "collapsed" && checkConnctionVisibility(edge, "riskObjects") !==
                    "collapsedGroup") ? (
                      <div style={{ display: !true ? "none" : "inline" }}>
                        {edge.name}
                      </div>
                    ) : (
                      ``
                    ),
                }}
                start={String("R-" + riskAssessmentId + "-" + edge.sourceRef)}
                end={String("R-" + riskAssessmentId + "-" + edge.targetRef)}
                SVGcanvasStyle={{ overflow: "hidden" }}
              />
            )
        )}

        {objectPropertyConnections.map((object) => (
          <Xarrow
            path="straight"
            curveness={0.2}
            strokeWidth={1.5}
            start={`R-${riskAssessmentId}-${object}`}
            end={`P-${riskAssessmentId}-${object}`}
            SVGcanvasStyle={{ overflow: "hidden" }}
            headColor="orange"
            tailColor="orange"
            lineColor="orange"
            // zIndex={1000000}
          />
        ))}

        <TransformWrapper
          zoomAnimation={{ disabled: true }}
          initialScale={globalScale}
          initialPositionX={raSettings.positionX}
          initialPositionY={raSettings.positionY}
          minScale={0.1}
          maxScale={5}
          doubleClick={{ disabled: true }}
          onZoom={(e) => {
            if (e.state.scale < 0.1) {
              e.state.scale = 0.1;
              e.zoomOut(0.1);
            }
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
                  onClick={() => zoomIn()}
                />
                <Button
                  small={true}
                  fill={false}
                  icon="minus"
                  onClick={() => zoomOut()}
                />
                <Button
                  small={true}
                  fill={false}
                  icon="reset"
                  onClick={() =>
                    setTransform(
                      -Math.floor(enviroDimension.width / 2),
                      -Math.floor(enviroDimension.height / 2),
                      1
                    )
                  }
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
                    handleContextMenu(e, { from: "main" });
                  }}
                  onClick={resetContext}
                >
                  {groups.length > 0 && checkFilter("group")
                    ? groups.map(
                        (group, index) =>
                          Number(
                            group.elements.filter((element) => element).length
                          ) +
                            Number(
                              group.dataObjects.filter((element) => element)
                                .length
                            ) >
                            0 && (
                            <RiskGroup
                              groups={groups.map((grp) => ({
                                id: grp.id,
                                name: grp.name,
                              }))}
                              setFirstContext={setFirstContext}
                              updateXarrow={updateXarrow}
                              handleContextMenu={handleContextMenu}
                              selectedElements={selectedElements}
                              elementSelection={elementSelection}
                              index={index}
                              data={group}
                              key={`grp-${riskAssessmentId}-${group.id}`}
                              riskAssessmentId={riskAssessmentId}
                              position={{
                                x: group.currentX,
                                y: group.currentY,
                              }}
                              editRiskObject={editRiskObject}
                              closedFace={closedFace}
                              scale={globalScale}
                              setHoveredElement={setHoveredElement}
                              handleObjectAction={handleObjectAction}
                              menu={menu}
                              handleProperties={handleProperties}
                              removeFromGroup={removeFromGroup}
                              handleObjectProperty={handleObjectProperty}
                              checkFilter={checkFilter}
                              enviroDimension={enviroDimension}
                              setGroups={setGroups}
                              addToGroup={addToGroup}
                            />
                          )
                      )
                    : null}

                  {objects.length > 0
                    ? objects.map(
                        (object, index) =>
                          checkFilter(
                            object.type,
                            object.status,
                            !object["position.enabled"]
                          ) && (
                            <RiskElement
                              groups={groups.map((grp) => ({
                                id: grp.id,
                                name: grp.name,
                              }))}
                              setFirstContext={setFirstContext}
                              expanded={true}
                              handleContextMenu={handleContextMenu}
                              selectedElements={selectedElements}
                              elementSelection={elementSelection}
                              key={`r-${riskAssessmentId}-${object.id}`}
                              data={object}
                              riskAssessmentId={riskAssessmentId}
                              position={{
                                x: object["position.x"],
                                y: object["position.y"],
                              }}
                              editRiskObject={editRiskObject}
                              closedFace={closedFace}
                              scale={globalScale}
                              setHoveredElement={setHoveredElement}
                              handleObjectAction={handleObjectAction}
                              menu={menu}
                              handleProperties={handleProperties}
                              removeFromGroup={removeFromGroup}
                              handleObjectProperty={handleObjectProperty}
                              enviroDimension={enviroDimension}
                              addToGroup={addToGroup}
                            />
                          )
                      )
                    : null}

                  {dataObjectInstances.length > 0
                    ? dataObjectInstances.map(
                        (dataObjectInstance) =>
                          checkFilter(
                            dataObjectInstance.dataObjectNew.IOtype,
                            dataObjectInstance.status,
                            dataObjectInstance.disable
                          ) && (
                            <DataObject
                              groups={groups.map((grp) => ({
                                id: grp.id,
                                name: grp.name,
                              }))}
                              riskAssessmentId={riskAssessmentId}
                              scale={globalScale}
                              expanded={true}
                              data={dataObjectInstance}
                              selectedElements={selectedElements}
                              elementSelection={elementSelection}
                              setFirstContext={setFirstContext}
                              setHoveredElement={setHoveredElement}
                              handleObjectAction={handleObjectAction}
                              removeFromGroup={removeFromGroup}
                              addToGroup={addToGroup}
                              key={`o-${riskAssessmentId}-${dataObjectInstance.id}`}
                              enviroDimension={enviroDimension}
                            />
                          )
                      )
                    : null}
                </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
        
      </Xwrapper>
    );
  }
};
