import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";
import { DraggableBox } from "./draggableBox";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { RiskElement } from "./riskElement";
import { useCallback, useState } from "react";

export const RiskAssessment = ({
  objects,
  riskAssessmentId,
  handleContextMenu,
  selectedElements,
  setSelectedElements,
  connections
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
          <svg width={"200%"}>
            {objects.length > 0
              ? objects.map((object, index) => (
                  <RiskElement
                    handleContextMenu={handleContextMenu}
                    selectedElements={selectedElements}
                    elementSelection={elementSelection}
                    index={index}
                    data={object}
                    riskAssessmentId={riskAssessmentId}
                    position={object.riskObjectsPositions.find(
                      (pos) => pos.riskAssessmentId === riskAssessmentId
                    )}
                  />
                ))
              : null}
            {/* {graph.nodes.map((node) => (
            <DataElement
              data={node}
              elementSelection={elementSelection}
              showContext={showContext}
              selectedElements={selectedElements}
            />
          ))} */}

            {/* {contextMenu.show && <ConnetionContext data={contextMenu} />} */}
          </svg>
        </TransformComponent>
        {connections.map((edge) => (
        <Xarrow
          path="smooth"
          curveness={0.2}
          strokeWidth={1}
          start={String(edge.sourceRef)}
          end={String(edge.targetRef)}
          SVGcanvasStyle={{ overflow: "hidden" }}
        />
      ))}
      </TransformWrapper>
    </Xwrapper>
  );
};
