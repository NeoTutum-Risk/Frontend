import React,{ useCallback, useState } from "react";
import { Rnd } from "react-rnd";
import { Button } from "@blueprintjs/core";
import "./dataElement.css";
// import { Tooltip } from "./dataElementTooltip";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { updateElementGroup } from "../../services";
import { showDangerToaster } from "../../utils/toaster";
export const ObjectsGroup = React.memo(
  ({
    data,
    handleContextMenu,
    position,
    riskAssessmentId,
    setFirstContext,
    scale,
    enviroDimension,
    setGroups,
    rootCall,
  }) => {
    const updateXarrow = useXarrow();
    // const updateXarrow = useXarrow();
    const [usingService, setUsingService] = useState(false);
    const [size, setSize] = useState({ w: data.width, h: data.height });
    const [expanded, setExpanded] = useState(data.expanded);
    const [drag, setDrag] = useState({
      active: false,
      cy: data.y >= 0 ? data.y : 0,
      cx: data.x >= 0 ? data.x : 0,
      offset: {},
    });

    const updateLocation = useCallback(
      async (e, d) => {
        setUsingService(true);
        let deltaX = drag.cx - d.x;
        let deltaY = drag.cy - d.y;
        if (Math.abs(deltaX) + Math.abs(deltaY) < 20) {
          setUsingService(false);
          return;
        }
        console.log("------", deltaX, deltaY);
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
        updateXarrow();
        const updateElementPosition = await updateElementGroup({
          dataObjectId: data.dataObjectId,
          refDataObjectGroupId: data.id,
          x: Math.round(d.x),
          y: Math.round(d.y),
          expanded: data.currentExpanded,
        });

        if (
          updateElementPosition.status >= 200 &&
          updateElementPosition.status < 300
        ) {
          rootCall("groupPositionUpdated", {
            id: data.id,
            x: Math.round(deltaX),
            y: Math.round(deltaY),
          });
        } else {
          showDangerToaster(`Error Updating Group`);
        }
        setUsingService(false);
      },
      [
        data.id,
        data.currentExpanded,
        updateXarrow,
        enviroDimension,
        data.dataObjectId,
        rootCall,
        drag,
      ]
    );

    const updateExpanded = useCallback(async () => {
      setGroups((prev) =>
        prev.map((grp) =>
          grp.id === data.id
            ? {
                ...grp,
                expanded: !expanded,
                currentExpanded: !data.currentExpanded,
              }
            : grp
        )
      );
      setExpanded((prev) => !prev);

      updateXarrow();
      try {
        const updateElementPosition = await updateElementGroup({
          dataObjectId: data.dataObjectId,
          refDataObjectGroupId: data.id,
          x: Math.round(drag.cx),
          y: Math.round(drag.cy),
          expanded: !expanded,
        });
        if (
          updateElementPosition.status >= 200 &&
          updateElementPosition.status < 300
        ) {
        } else {
          showDangerToaster(`Faild To Update Group`);
          setGroups((prev) =>
            prev.map((grp) =>
              grp.id === data.id
                ? {
                    ...grp,
                    expanded: !expanded,
                    currentExpanded: !data.currentExpanded,
                  }
                : grp
            )
          );
          setExpanded((prev) => !prev);
        }
      } catch (error) {
        showDangerToaster(`Faild To Update Group`);
        setGroups((prev) =>
          prev.map((grp) =>
            grp.id === data.id
              ? {
                  ...grp,
                  expanded: !expanded,
                  currentExpanded: !data.currentExpanded,
                }
              : grp
          )
        );
        setExpanded((prev) => !prev);
      }
    }, [
      data.id,
      drag.cx,
      drag.cy,
      expanded,
      updateXarrow,
      data.currentExpanded,
      setGroups,
      data.dataObjectId,
    ]);

    const handleClick = useCallback(
      (e) => {
        e.preventDefault();
        if (e.detail !== 2) return;
        updateExpanded();
      },
      [updateExpanded]
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
        updateXarrow();
        const updateOjectPosition = await updateElementGroup({
          dataObjectId: data.dataObjectId,
          refDataObjectGroupId: data.id,
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: w,
          height: h,
          expanded,
        });
      },
      [data, updateXarrow, size, expanded]
    );
    return (
      <>
        <Rnd
          id={`group-object-${data.id}`}
          key={`group-object-${data.id}`}
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
          onDrag={updateXarrow}
          onDragStop={(e, d) => updateLocation(e, d)}
          onResize={updateXarrow}
          onResizeStop={(e, direction, ref, delta, position) => {
            updateSize(delta, direction, position);
          }}
          scale={scale}
        >
          <div
            onMouseEnter={() => rootCall("objectIn", { id: data.id })}
            onMouseLeave={() => rootCall("objectOut")}
            onContextMenu={(e) => rootCall("context", { e, type: "groupMenu" })}
            // title={data.description}
            onClick={handleClick}
            className="risk-object-container panningDisabled"
            style={{
              border: !expanded
                ? "5px solid #173c67"
                : "5px dashed rgb(56	142	142	)",
              backgroundColor: !expanded
                ? usingService
                  ? "#fef9c5 "
                  : "#173c67"
                : "white",
              color: !expanded
                ? usingService
                  ? "rgb(56	142	142	)"
                  : "white"
                : "rgb(56	142	142	)",
              borderRadius: "150px",
              padding: "5px",
              textAlign: "center",
              display: "flex",
            }}
          >
            <span>{data.shared && !data.mainShared ? "S" : ""}</span>
            <span>
              <b>{data.name}</b>
            </span>
            <span>
              <b>{data.id}</b>
            </span>
          </div>
        </Rnd>
      </>
    );
  }
);
