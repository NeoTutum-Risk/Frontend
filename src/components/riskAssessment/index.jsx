import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";
import { Button, TextArea, Menu, MenuItem, HTMLSelect, FormGroup, Intent } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
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
  globalViewIndex,
  views,
  charts,
  getAnalytics,
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
  metaDataList,
  analysisPacks,
  handleProperties,
  removeFromGroup,
  addToGroup,
  checkFilter,
  checkConnctionVisibility,
  setGroups,
  handleUnshareGroup,
  connectionForm,
  openedGroup,
  handleOpenedGroup,
  openedGroupConnections
}) => {
  
  const [enviroDimension, setEnviroDimension] = useState({
    height: 50000,
    width: 50000,
  });
  const transformWrapperRef = useRef(null);
  const [loadingAnalytics,setLoadingAnalytics] = useState(false);

  const [objectPropertyConnections, setObjectPropertyConnections] = useState(
    []
  );
  const [selectedObjects, setSelectedObjects] =
    useRecoilState(objectSelectorState);
  const [globalScale, setGlobalScale] = useState(1);
  const [initialGlobalScale, initializeGlobalScale] = useState(true);
  const getCenter = useCallback(() => {
    let objectsArray = [...objects];
    let top = enviroDimension.height;
    let left = enviroDimension.width;
    let right = 0,
      bottom = 0;
    groups.forEach((grp) => {
      if (grp.elements.length > 1) {
        objectsArray = [...objectsArray, ...grp.elements];
      }
    });

    objectsArray.forEach((obj) => {
      if (obj !== null) {
        top = obj["position.y"] < top ? obj["position.y"] : top;
        left = obj["position.x"] < left ? obj["position.x"] : left;
        bottom = obj["position.y"] > bottom ? obj["position.y"] : bottom;
        right = obj["position.x"] > right ? obj["position.x"] : right;
      }
    });

    return { x: (right - left) / 2 + left, y: (bottom - top) / 2 + top };
  }, [enviroDimension, objects, groups]);
  const [raSettings, setRASettings] = useState({
    id: 0,
    positionX: -Math.floor(getCenter().x),
    positionY: -Math.floor(getCenter().y),
    previousScale: 1,
    scale: 1,
  });
  const [loadingZoomSettings, setloadingZoomSettings] = useState(true);
  const initializeWindow = useCallback(() => {
    if (initialGlobalScale) {
      setTimeout(() => {
        setGlobalScale(raSettings.scale);
        initializeGlobalScale(false);
      }, 500);
    }
  }, [initializeGlobalScale, initialGlobalScale, raSettings.scale]);

  const getWindowSettings = useCallback(async () => {
    setloadingZoomSettings(true);
    const res = await getRiskAssessmentWindowSettings(riskAssessmentId);

    const { id, positionX, positionY, previousScale, scale } = res.data.data;

    setRASettings({
      id,
      positionX,
      positionY,
      scale,
      previousScale,
    });
  }, [riskAssessmentId]);

  useEffect(() => {
    getWindowSettings().then(() => {
      setloadingZoomSettings(false);
    });
  }, [getWindowSettings]);
  useEffect(() => {
    initializeWindow();
  }, [initializeWindow]);
  const updateRAWindowSettings = useCallback(async () => {
    await updateRiskAssessmentWindowSettings(riskAssessmentId, raSettings);
  }, [raSettings, riskAssessmentId]);

  const elementSelection = useCallback(
    (elementData, state) => {
      if (state) {
        setSelectedElements((prev) => {
          return [...new Set([...prev, elementData])];
        });
        setSelectedObjects((prev) => {
          return [...new Set([...prev, elementData])];
        });
      } else {
        setSelectedElements((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
        setSelectedObjects((prev) =>
          prev.filter((element) => element.id !== elementData.id)
        );
      }
    },
    [setSelectedElements, setSelectedObjects]
  );

  const updateAnalytics = useCallback(async (chartsType, data = {})=>{
    const response = await getAnalytics(chartsType, data);

    setLoadingAnalytics(true);
    if(response){
      
    }else{

    }
    setLoadingAnalytics(false);
  },[getAnalytics])

  // (() => {

  // })();

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
      // ("RA State before update settings:", raState);
      // setRASettings({ ...raState });
      // (raState);
      // setRASettings({
      //   positionX: -Math.floor(e.offsetX),
      //   positionY: -Math.floor(e.offsetY),
      //   scale: ref.state.scale,
      //   previousScale: ref.state.previousScale,
      // });
      setRASettings({
        id: raSettings.id,
        positionX: raState.positionX,
        positionY: raState.positionY,
        scale: raState.scale,
        previousScale: raState.previousScale,
      });
      setGlobalScale(raState.scale < 0.1 ? 0.1 : raState.scale);

      updateXarrow();
      setTimeout(updateXarrow, 0);
      setTimeout(updateXarrow, 100);
      setTimeout(updateXarrow, 300);
      setTimeout(updateXarrow, 500);
    },
    [updateXarrow, raSettings]
  );

  // ('raSettings -> ',raSettings);
  // ('globalScale -> ',globalScale);

  if (loadingZoomSettings || initialGlobalScale) {
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
        

        <TransformWrapper
          zoomAnimation={{ disabled: true }}
          initialScale={raSettings.scale}
          initialPositionX={raSettings.positionX}
          initialPositionY={raSettings.positionY}
          minScale={0.1}
          maxScale={5}
          doubleClick={{ disabled: true }}
          onZoom={(ref, e) => {
            // (ref);
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
            // ("event zoom1", e);
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
                <Popover2
                  // className={styles.addWindowsButton}
                  // position='left-top'
                  interactionKind="click-target"
                  content={
                    <Menu>
                      <>
                        <MenuItem
                          icon="derive-column"
                          text="Generic"
                          onClick={() => updateAnalytics('generic')}
                          disabled={true}
                        />
                        <MenuItem
                          icon="derive-column"
                          text="Bayesian"
                          onClick={() => updateAnalytics('bayesian')}
                        />
                        <MenuItem
                          icon="derive-column"
                          text="Analysis Packs"
                          // onClick={() => updateAnalytics('analysispack')}
                        >
                        {
                          analysisPacks.map(({name: packName, metaDataIdentifierId}) => (
                            <MenuItem
                              icon="derive-column"
                              text={packName}
                              
                            >
                              <HTMLSelect onClick={(e) => {
                                (e.target.value) !== 'Select Property' && updateAnalytics('analysispack', { name: packName, metaDataIdentifierId, property: e.target.value })
                              }}>
                                <option selected disabled>
                                  Select Property
                                </option>
                                {metaDataList ? (
                                  metaDataList.map((data) => {
                                    const mainLevel = [
                                      <option disabled>MDL1 - {data.name}</option>,
                                      ...data.metaDataLevel2s.map((l2) => (
                                        <option value={l2.id}>{l2.name}</option>
                                      )),
                                    ];
                                    return mainLevel;
                                  })
                                ) : (
                                  <option>Loading Data</option>
                                )}
                              </HTMLSelect>
                            </MenuItem>
                          ))
                        }
                        </MenuItem>
                      </>
                    </Menu>
                  }
                >
                  <Button
                    small={true}
                    fill={false}
                    icon="refresh"
                    loading={loadingAnalytics} 
                    
                  />
                </Popover2>
                {openedGroup && <Button
                intent="DANGER"
                  small={true}
                  fill={false}
                  text={openedGroup}
                  onClick={()=>handleOpenedGroup("","clear")}
                />}
              </div>
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                }}
                contentStyle={{
                  width: `${enviroDimension.width}px`,
                  height: `${enviroDimension.height}px`,
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
                    handleContextMenu(e, { from: "main" });
                  }}
                  onClick={resetContext}
                >
                  

                  {objects.length > 0
                    ? objects.map(
                        (object, index) =>
                          checkFilter(
                            object.type,
                            object.status,
                            !object["position.enabled"]
                          ) && (
                            <RiskElement
                            globalViewIndex={globalViewIndex}
                            views={views}
                            charts={charts}
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
                              shared={0}
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
                            globalViewIndex={globalViewIndex}
                            views={views}
                              groups={groups.map((grp) => ({
                                id: grp.id,
                                name: grp.name,
                              }))}
                              handleContextMenu={handleContextMenu}
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
                              shared={0}
                            />
                          )
                      )
                    : null}

{groups.length > 0 && checkFilter("group")
                    ? groups.map(
                        (group, index) =>
                          Number(
                            group.elements.filter(
                              (element) =>
                                element && element.status !== "delete"
                            ).length
                          ) +
                            Number(
                              group.dataObjects.filter(
                                (element) =>
                                  element && element.status !== "delete"
                              ).length
                            ) >
                            0 && (
                            <RiskGroup
                            globalViewIndex={globalViewIndex}
                            views={views}
                            charts={charts}
                            connectionForm={connectionForm}
                              groups={groups.map((grp) => ({
                                id: grp.id,
                                name: grp.name,
                              }))}
                              handleOpenedGroup={handleOpenedGroup}
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
                              handleUnshareGroup={handleUnshareGroup}
                            />
                          )
                      )
                    : null}
                </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>

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
                    checkConnctionVisibility(edge, "dataObjects") !==
                      "collapsed" &&
                    checkConnctionVisibility(edge, "dataObjects") !==
                      "collapsedGroup" ? (
                      <div
                        style={{
                          fontSize: `${globalScale * 24}px`,
                        }}
                      >
                        {edge.name !== "No name" ? edge.name : ""}
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
            // (String((edge.objectType==="Input"?"D-":"R-") + riskAssessmentId + "-" + edge.sourceRef))
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
                    checkConnctionVisibility(edge, "riskDataObjects") !==
                      "collapsed" &&
                    checkConnctionVisibility(edge, "riskDataObjects") !==
                      "collapsedGroup" ? (
                      <div
                        style={{
                          fontSize: `${globalScale * 24}px`,
                        }}
                      >
                        {edge.name !== "No name" ? edge.name : ""}
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
                    checkConnctionVisibility(edge, "riskObjects") !==
                      "collapsed" &&
                    checkConnctionVisibility(edge, "riskObjects") !==
                      "collapsedGroup" ? (
                      <div
                        style={{
                          fontSize: `${globalScale * 24}px`,
                        }}
                      >
                        {edge.name !== "No name" ? edge.name : ""}
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

{openedGroupConnections.map(
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
                showHead={true}
                labels={{
                  middle:<div
                  style={{
                    fontSize: `${globalScale * 24}px`,
                  }}
                >
                  {edge.name !== "No name" ? edge.name : ""}
                </div>
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
      </Xwrapper>
    );
  }
};
