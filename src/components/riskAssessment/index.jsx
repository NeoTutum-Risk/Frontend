import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";
import { DraggableBox } from "./draggableBox";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { RiskElement } from "./riskElement";
import { RiskGroup } from "./riskGroup";
import { useCallback, useState, Fragment } from "react";
import { objectSelectorState } from "../../store/objectSelector";
import { useRecoilState } from "recoil";
import { DataObject } from "./dataObject";
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
  checkFilter,
  checkConnctionVisibility,
  setGroups,
}) => {
  const [objectPropertyConnections, setObjectPropertyConnections] = useState(
    []
  );
  const [selectedObjects, setSelectedObjects] =
    useRecoilState(objectSelectorState);
  const [globalScale, setGlobalScale] = useState(1);
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
  const handleZoomPanPinch = useCallback(() => {
    updateXarrow();
    setTimeout(updateXarrow, 0);
    setTimeout(updateXarrow, 100);
    setTimeout(updateXarrow, 300);
    setTimeout(updateXarrow, 500);
    console.log("ZOOMPANPINCH");
  }, [updateXarrow]);

  const enviroDimension = { height: 50000, width: 50000 };
  return (
    // <div
    //   style={{ overflow: "auto", height: "100%", width: "100%",position:"relative" }}
    //   onScroll={updateXarrow}
    //   onContextMenu={(e) => handleContextMenu(e, { from: "main" })}
    //   onClick={resetContext}
    // >
    <Xwrapper>
      <TransformWrapper
        initialScale={1}
        initialPositionX={-Math.floor(enviroDimension.width / 2)}
        initialPositionY={-Math.floor(enviroDimension.height / 2)}
        minScale={0.1}
        maxScale={5}
        doubleClick={{ disabled: true }}
        onZoom={updateXarrow}
        onZoomStop={(e) => {
          handleZoomPanPinch();
          setGlobalScale(e.state.scale < 0.1 ? 0.1 : e.state.scale);
          console.log(e);
        }}
        onPinching={updateXarrow}
        onPinchingStop={handleZoomPanPinch}
        onPanning={updateXarrow}
        onPanningStop={handleZoomPanPinch}
        panning={{ excluded: ["panningDisabled"], activationKeys: ["Control"] }}
        pinch={{ excluded: ["pinchDisabled"], activationKeys: ["Control"] }}
        wheel={{ excluded: ["wheelDisabled"], activationKeys: ["Control"] }}
      >
        {instanceConnections.map(
          (edge) =>
            checkConnctionVisibility(edge, "dataObjects") && (
              <Xarrow
              zIndex={1000000}
                key={edge.sourceRef + " " + edge.targetRef}
                path="straight"
                curveness={0.2}
                strokeWidth={1.5}
                color="#29A634"
                headColor="#29A634"
                tailColor="#29A634"
                lineColor="#29A634"
                labels={{
                  middle:
                    checkConnctionVisibility(edge, "dataObjects") !==
                    "collapsed" ? (
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
              zIndex={1000000}
                key={edge.sourceRef + " " + edge.targetRef}
                path="straight"
                curveness={0.2}
                strokeWidth={1.5}
                color="#29A634"
                headColor="#29A634"
                tailColor="#29A634"
                lineColor="#29A634"
                labels={{
                  middle:
                    checkConnctionVisibility(edge, "riskDataObjects") !==
                    "collapsed" ? (
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
              zIndex={1000000}
                key={edge.sourceRef + " " + edge.targetRef}
                path="straight"
                curveness={0.2}
                strokeWidth={1.5}
                labels={{
                  middle:
                    checkConnctionVisibility(edge, "riskObjects") !==
                    "collapsed" ? (
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
            zIndex={1000000}
          />
        ))}

        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            backgroundColor: "#cccaca",
          }}
          contentStyle={{
            width: `${enviroDimension.width}px`,
            height: `${enviroDimension.height}px`,
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              overflow: "auto",
              height: `${enviroDimension.height}px`,
              width: `${enviroDimension.width}px`,
              position: "relative",
              border: "30px solid black",
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
                    Number(group.elements.filter((element) => element).length) +
                      Number(
                        group.dataObjects.filter((element) => element).length
                      ) >
                      0 && (
                      <RiskGroup
                        setFirstContext={setFirstContext}
                        updateXarrow={updateXarrow}
                        handleContextMenu={handleContextMenu}
                        selectedElements={selectedElements}
                        elementSelection={elementSelection}
                        index={index}
                        data={group}
                        key={`grp-${group.id}`}
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
                        setFirstContext={setFirstContext}
                        expanded={true}
                        handleContextMenu={handleContextMenu}
                        selectedElements={selectedElements}
                        elementSelection={elementSelection}
                        key={`r-${object.id}`}
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
                        key={`o-${dataObjectInstance.id}`}
                        enviroDimension={enviroDimension}
                      />
                    )
                )
              : null}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </Xwrapper>
  );
};
