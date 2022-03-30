import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";
import { DraggableBox } from "./draggableBox";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { RiskElement } from "./riskElement";
import { RiskGroup } from "./riskGroup";
import { useCallback, useState } from "react";

export const RiskAssessment = ({
  objects,
  groups,
  riskAssessmentId,
  handleContextMenu,
  selectedElements,
  setSelectedElements,
  connections,
  onContext,
}) => {
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
    <Xwrapper>
      <TransformWrapper
        initialScale={1}
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
          wrapperStyle={{ width: "250%", height: "100%" }}
          contentStyle={{ width: "250%", height: "250%" }}
        >
          <svg width={"200%"} onContextMenu={handleContextMenu} id="svg">
            <defs>
              <pattern
                id="smallGrid"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 8 0 L 0 0 0 8"
                  fill="none"
                  stroke="gray"
                  stroke-width="0.1"
                />
              </pattern>
              <pattern
                id="grid"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <rect width="80" height="80" fill="url(#smallGrid)" />
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="gray"
                  stroke-width=".3"
                />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />
            {objects.length > 0
              ? objects.map((object, index) => (
                  <RiskElement
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
                  />
                ))
              : null}

            {groups.length > 0
              ? groups.map((group, index) => (
                  <RiskGroup
                    updateXarrow={updateXarrow}
                    handleContextMenu={handleContextMenu}
                    selectedElements={selectedElements}
                    elementSelection={elementSelection}
                    index={index}
                    data={group}
                    riskAssessmentId={riskAssessmentId}
                    position={{
                      x: group.x,
                      y: group.y,
                    }}
                  />
                ))
              : null}
          </svg>
        </TransformComponent>
        {connections.map((edge) => (
          <Xarrow
            path="straight"
            curveness={0.2}
            strokeWidth={1.5}
            // headShape={"arrow"}
            // tailShape={"arrow"}
            // headSize={7}
            // tailSize={7}
            labels={{ middle: edge.name }}
            start={String(edge.sourceRef)}
            end={String(edge.targetRef)}
            SVGcanvasStyle={{ overflow: "hidden" }}
          />
        ))}
        {groups.length > 0
          ? groups.map((group, index) =>
              group.elements.map((element) => (
                <Xarrow
                  color="#e07a5f"
                  path="smooth"
                  curveness={0.2}
                  strokeWidth={1}
                  start={String(element.id)}
                  dashness={{ strokeLen: 5, nonStrokeLen: 5, animation: -1 }}
                  animation={1}
                  headShape={"circle"}
                  tailShape={"circle"}
                  headSize={3}
                  tailSize={3}
                  // animateDrawing={true}
                  end={String(group.id)}
                  SVGcanvasStyle={{ overflow: "hidden" }}
                />
              ))
            )
          : null}
      </TransformWrapper>
    </Xwrapper>
  );
};
