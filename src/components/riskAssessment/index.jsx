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
  removeFromGroup
}) => {
  // console.log("index",typeof setFirstContext);
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
  const updateXarrow = useXarrow();
  const handleZoomPanPinch = useCallback(() => {
    updateXarrow();
    setTimeout(updateXarrow, 0);
    setTimeout(updateXarrow, 100);
    setTimeout(updateXarrow, 300);
    setTimeout(updateXarrow, 500);
    console.log("ZOOMPANPINCH");
  }, [updateXarrow]);
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
        minScale={0.1}
        maxScale={5}
        doubleClick={{ disabled: true }}
        onZoom={updateXarrow}
        onZoomStop={(e) => {
          handleZoomPanPinch();
          setGlobalScale(e.state.scale);
          console.log(e);
        }}
        onPinching={updateXarrow}
        onPinchingStop={handleZoomPanPinch}
        onPanning={updateXarrow}
        onPanningStop={handleZoomPanPinch}
        panning={{ excluded: ["panningDisabled"] }}
        pinch={{ excluded: ["pinchDisabled"] }}
        wheel={{ excluded: ["wheelDisabled"] }}
      >
        {instanceConnections.map((edge) => (
          <Xarrow
            path="straight"
            curveness={0.2}
            strokeWidth={1.5}
            color="#29A634"
            headColor="#29A634"
            tailColor="#29A634"
            lineColor="#29A634"
            labels={{
              middle: (
                <div style={{ display: !true ? "none" : "inline" }}>
                  {edge.name}
                </div>
              ),
            }}
            start={String("D-" + riskAssessmentId + "-" + edge.sourceRef)}
            end={String("D-" + riskAssessmentId + "-" + edge.targetRef)}
            SVGcanvasStyle={{ overflow: "hidden" }}
          />
        ))}

        {instanceObjectConnections.map((edge) => (
          // console.log(String((edge.objectType==="Input"?"D-":"R-") + riskAssessmentId + "-" + edge.sourceRef))
          <Xarrow
            path="straight"
            curveness={0.2}
            strokeWidth={1.5}
            color="#29A634"
            headColor="#29A634"
            tailColor="#29A634"
            lineColor="#29A634"
            labels={{
              middle: (
                <div style={{ display: !true ? "none" : "inline" }}>
                  {edge.name}
                </div>
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
        ))}

        {connections.map((edge) => (
          <Xarrow
            path="straight"
            curveness={0.2}
            strokeWidth={1.5}
            labels={{
              middle: (
                <div style={{ display: !true ? "none" : "inline" }}>
                  {edge.name}
                </div>
              ),
            }}
            start={String("R-" + riskAssessmentId + "-" + edge.sourceRef)}
            end={String("R-" + riskAssessmentId + "-" + edge.targetRef)}
            SVGcanvasStyle={{ overflow: "hidden" }}
          />
        ))}

        <TransformComponent
          wrapperStyle={{ width: "800%", height: "800%" }}
          contentStyle={{ width: "800%", height: "800%" }}
        >
          <div
            style={{
              overflow: "auto",
              height: "8000px",
              width: "8000px",
              position: "relative",
            }}
            onScroll={updateXarrow}
            onContextMenu={(e) => {
              console.log(e);
              handleContextMenu(e, { from: "main" });
            }}
            onClick={resetContext}
          >
            {groups.length > 0
              ? groups.map((group, index) => (
                  <RiskGroup
                    setFirstContext={setFirstContext}
                    updateXarrow={updateXarrow}
                    handleContextMenu={handleContextMenu}
                    selectedElements={selectedElements}
                    elementSelection={elementSelection}
                    index={index}
                    data={group}
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
                  />
                ))
              : null}

            {objects.length > 0
              ? objects.map(
                  (object, index) =>
                    object.status !== "deleted" && (
                      <RiskElement
                        setFirstContext={setFirstContext}
                        expanded={true}
                        handleContextMenu={handleContextMenu}
                        selectedElements={selectedElements}
                        elementSelection={elementSelection}
                        index={index}
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
                      />
                    )
                )
              : null}

            {dataObjectInstances.length > 0
              ? dataObjectInstances.map(
                  (dataObjectInstance) =>
                    dataObjectInstance.status !== "deleted" && (
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
