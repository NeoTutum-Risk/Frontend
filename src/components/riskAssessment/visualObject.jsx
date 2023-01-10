import { useCallback, useState } from "react";
import { RiskElement } from "./riskElement";
import { DataObject } from "./dataObject";
import { Rnd } from "react-rnd";
import { Button, ButtonGroup, TextArea } from "@blueprintjs/core";
import "./dataElement.css";
// import { Tooltip } from "./dataElementTooltip";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { editVisualObject } from "../../services";
import { showDangerToaster } from "../../utils/toaster";
export const VisualObject = ({
  data,
  enviroDimension,
  riskAssessmentId,
  scale,
  setFirstContext,
  handleContextMenu
}) => {
  // (data.id)
  // const updateXarrow = useXarrow();
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [groupDescription, setGroupDescription] = useState(data.description);
  const [size, setSize] = useState({
    w: data.width,
    h: data.height,
  });
  
  const [drag, setDrag] = useState({
    active: false,
    cy: data.y >= 0 ? data.y : 0,
    cx: data.x >= 0 ? data.x : 0,
    offset: {},
  });


  const updateLocation = useCallback(
    async (e, d) => {
      setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
      if (d.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        d.x = 0;
      }

      if (d.x > enviroDimension.width - 500) {
        setDrag((prev) => ({ ...prev, cx: enviroDimension.width - 500 }));
        d.x = enviroDimension.width - 500;
      }

      if (d.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        d.y = 0;
      }

      if (d.y > enviroDimension.height - 500) {
        setDrag((prev) => ({ ...prev, cy: enviroDimension.height - 500 }));
        d.y = enviroDimension.height - 500;
      }
      // updateXarrow();
      const updateElementPosition = await editVisualObject(
        data.id,
        {
          x: Math.round(d.x),
          y: Math.round(d.y),
          expanded: data.currentExpanded,
        }
      );
    },
    [
      data.id,
      data.currentExpanded,
      enviroDimension,
    ]
  );

  const updateSize = useCallback(
    async (delta, direction, position) => {
      // (data,delta,position);
      const w = Math.round(size.w + delta.width);
      const h = Math.round(size.h + delta.height);
      setSize({ w, h });
      setDrag((prev) => ({ ...prev, cy: position.y, cx: position.x }));
      if (position.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        position.x = 0;
      }

      if (position.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        position.y = 0;
      }

      const updateOjectPosition = await editVisualObject(
        data.id,
        {
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: w,
          height: h,
        }
      );
    },
    [data, size]
  );


  return (
    <>
      {/* {expanded &&
        data.riskObjectGroupElements.map((object) => (
          <g id={object.riskObjectId}>
            {
              <circle
                r={35}
                cy={drag.cy}
                cx={drag.cx}
                fill-opacity="0"
                stroke-opacity="0"
              />
            }
          </g>
        ))} */}

        <Rnd
          id={`vo-${data.modelGroup ? "M" : ""}${riskAssessmentId}-${
            data.id
          }`}
          key={`vo-${riskAssessmentId}-${data.id}`}
          default={{
            x: drag.cx,
            y: drag.cy,
            width: size.w,
            height: size.h,
          }}
          position={{
            x: drag.cx,
            y: drag.cy,
          }}
          size={{
            width: size.w,
            height: size.h,
          }}
          minWidth={75}
          minHeight={75}
          bounds="window"
          onDrag={(e, d) => {
            setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
          }}
          onDragStop={(e, d) => updateLocation(e, d)}
          onResizeStop={(e, direction, ref, delta, position) => {
            updateSize(delta, direction, position);
          }}
          scale={scale}
        >

            <div
              onMouseLeave={() => setFirstContext("main")}
              onMouseEnter={() => setFirstContext("visualObject")}
              onContextMenu={(e) => {
                e.preventDefault();
                handleContextMenu(e, data);
              }}
              // onClick={handleClick}
              className="risk-object-container panningDisabled pinchDisabled wheelDisabled "
              style={{
                border: "2px dashed #173c67",
                backgroundColor: "white" ,
                color:  "black" ,
                padding: "5px",
                textAlign: "center",
                display: "flex",
                flexDirection:"column",
                
              }}
            >
              {data.text && <p>{data.text}</p>}
              {data.filePath && <img
              style={{ width: "100%", height: "auto", marginTop: "5px" ,overflow:"auto"}}
              src={data.filePath}
              alt="Error Rendering Chart"
            />}
            </div>
        </Rnd>

   

   
    </>
  );
};
