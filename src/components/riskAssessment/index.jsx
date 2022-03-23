import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";
import { DraggableBox } from "./draggableBox";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useCallback } from "react";
export const RiskAssessment = ({ objects, riskAssessmentId, handleContextMenu }) => {


  
  return (
    // <TransformWrapper>
    //   <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}
    //       contentStyle={{ width: "250%", height: "250%" }}>
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        overflow: "auto",
        display: "flex",
        color: "black",
      }}
      id="canvas"
    >
      
      <Xwrapper>
        {objects.length > 0
          ? objects.map((object) => (
              <DraggableBox
              handleContextMenu={handleContextMenu}
                data={object}
                position={object.riskObjectsPositions.find(
                  (pos) => pos.riskAssessmentId === riskAssessmentId
                )}
              />
            ))
          : null}
      </Xwrapper>
    </div>
    // </TransformComponent>
    // </TransformWrapper>
  );
};
