import { ClosedEitor } from "./closedEditor";
import { OpenFace } from "./openFace";
import { ClosedFace } from "./closedFace";
import { Rnd } from "react-rnd";
import Resizable from "react-resizable-box";
import { useCallback, useState, useEffect } from "react";
import "./dataElement.css";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { updateRiskObjectPosition } from "../../services";
import Draggable from "react-draggable";
import { PropertiesWindow } from "./propertiesWindow";
import { ChartWindow } from "./chartWindow";
export const RiskElement = ({
  data,
  selectedScenario,
  selectedScenarioRun,
  elementSelection,
  handleContextMenu,
  selectedElements,
  position,
  index,
  riskAssessmentId,
  expanded,
  expandPosition,
  setFirstContext,
  groupId,
  editRiskObject,
  closedFace,
  scale,
  setHoveredElement,
  handleObjectAction,
  menu,
  handleProperties,
  removeFromGroup,
  handleObjectProperty,
  enviroDimension,
  groups,
  addToGroup,
  shared,
  charts,
  globalViewIndex,
  views,
}) => {
  const [view, setView] = useState(views[data.faceIndex]);
  const [chartIndex, setChartIndex] = useState(data.chartIndex | 0);
  const [size, setSize] = useState({
    w: data["position.width"],
    h: data["position.height"],
  });
  const [groupIdState, setGroupIdState] = useState(groupId);
  const [face, setFace] = useState(true);
  
  const [showProperties, setShowProperties] = useState(false);
  const [showChartsWindow, setShowChartsWindow] = useState(false);
  const [editor, setEditor] = useState(false);
  const updateXarrow = useXarrow();
  const [drag, setDrag] = useState({
    active: false,
    cy: position.y >= 0 ? position.y : 0,
    cx: position.x >= 0 ? position.x : 0,
    offset: {},
  });

  useEffect(() => {
    setFace(!closedFace);
  }, [closedFace]);

  useEffect(() => {
    setView(views[globalViewIndex?globalViewIndex:data.faceIndex]);
  }, [globalViewIndex, views,data.faceIndex]);

  // useEffect(()=>{
  //   if(!expanded){
  //     setDrag((prev) => ({ ...prev, cy: expandPosition.y, cx: expandPosition.x }));

  //     updateXarrow();
  //   }
  // },[expanded,expandPosition,updateXarrow])

  const handleCharts = useCallback(() => {}, []);

  const updateSize = useCallback(
    async (delta, direction, position) => {
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

      const updateElementPosition = await updateRiskObjectPosition(
        riskAssessmentId,
        data.id,
        {
          x: Math.round(position.x),
          y: Math.round(position.y),
          width: w,
          height: h,
          enabled: data["position.enabled"],
        }
      );
    },
    [riskAssessmentId, data, updateXarrow, size]
  );

  const updateLocation = useCallback(
    async (e, d) => {
      setDrag((prev) => ({ ...prev, cy: d.y, cx: d.x }));
      if (d.x < 0) {
        setDrag((prev) => ({ ...prev, cx: 0 }));
        d.x = 0;
      }

      if (d.x > enviroDimension.width - 200) {
        setDrag((prev) => ({ ...prev, cx: enviroDimension.width - 200 }));
        d.x = enviroDimension.width - 200;
      }

      if (d.y < 0) {
        setDrag((prev) => ({ ...prev, cy: 0 }));
        d.y = 0;
      }

      if (d.y > enviroDimension.height - 200) {
        setDrag((prev) => ({ ...prev, cy: enviroDimension.height - 200 }));
        d.y = enviroDimension.height - 200;
      }
      updateXarrow();
      const updateElementPosition = await updateRiskObjectPosition(
        riskAssessmentId,
        data.id,
        {
          x: Math.round(d.x),
          y: Math.round(d.y),
          enabled: data["position.enabled"],
        }
      );
    },
    [riskAssessmentId, data, updateXarrow, enviroDimension]
  );

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (e.detail !== 2) return;
      if (!data["position.enabled"]) return;
      elementSelection(
        data,
        selectedElements.find(
          (element) => element.id === data.id && data.type !== "instance"
        )
          ? false
          : true
      );
    },
    [elementSelection, data, selectedElements]
  );

  const updateSelectedChart = useCallback(async (index)=>{
    const response = await editRiskObject(data.id, {chartIndex:index, riskAssessmentId}, groupId);
  },[data.id,groupId,editRiskObject,riskAssessmentId])

  const updateSelectedFace = useCallback(async (index)=>{
    const response = await editRiskObject(data.id, {faceIndex:index, riskAssessmentId}, groupId);
  },[data.id,groupId,editRiskObject,riskAssessmentId])

  return (
    <>
      {expanded
        ? showProperties &&
          data["position.enabled"] && (
            <>
              <PropertiesWindow
                selectedScenario={selectedScenario}
                selectedScenarioRun={selectedScenarioRun}
                scale={scale}
                riskAssessmentId={riskAssessmentId}
                enabled={data["position.enabled"]}
                setShowProperties={setShowProperties}
                data={{
                  id: data.id,
                  x:
                    drag.cx - (420 + 50) > 0
                      ? drag.cx - (420 + 50)
                      : drag.cx + data["position.width"] + 50,
                  y: drag.cy,
                }}
                menu={menu}
                handleProperties={handleProperties}
              />
            </>
          )
        : null}
      {expanded
        ? showChartsWindow &&
          data["position.enabled"] && (
            <>
              <ChartWindow
              updateSelectedChart={updateSelectedChart}
                charts={charts.filter(
                  (chart) => chart.riskObjectId === String(data.id)
                )}
                selectedScenario={selectedScenario}
                selectedScenarioRun={selectedScenarioRun}
                scale={scale}
                riskAssessmentId={riskAssessmentId}
                enabled={data["position.enabled"]}
                setShowProperties={setShowProperties}
                data={{
                  id: data.id,
                  x:
                    drag.cx - (420 + 50) > 0
                      ? drag.cx - (420 + 50)
                      : drag.cx + data["position.width"] + 50,
                  y: drag.cy,
                }}
                menu={menu}
                handleCharts={handleCharts}
                chartIndex={chartIndex}
                setChartIndex={setChartIndex}
              />
            </>
          )
        : null}
      <Rnd
        id={`R-${riskAssessmentId}-${data.id}`}
        key={`R-${riskAssessmentId}-${data.id}`}
        // disableDragging={!data["position.enabled"]}
        enableResizing={!!data["position.enabled"]}
        default={{
          x: expanded ? drag.cx : expandPosition.x,
          y: expanded ? drag.cy : expandPosition.y,
          width: expanded ? size.w : 150,
          height: expanded ? size.h : 150,
        }}
        position={{
          x: expanded ? drag.cx : expandPosition.x,
          y: expanded ? drag.cy : expandPosition.y,
        }}
        size={{
          width: expanded ? size.w : 150,
          height: expanded ? size.h : 150,
        }}
        minWidth={50}
        minHeight={50}
        bounds="window"
        onDrag={updateXarrow}
        onResize={updateXarrow}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateSize(delta, direction, position);
        }}
        scale={scale}
        onDragStop={(e, d) => updateLocation(e, d)}
        style={{
          zIndex: expanded
            ? data["position.zIndex"] | 1
            : showProperties
            ? 100
            : 1,
        }}
      >
        {expanded ? (
          <div
            onMouseLeave={() => {
              setFirstContext("main");
              // setHoveredElement(null);
            }}
            onMouseEnter={() => {
              setFirstContext("element");
              setHoveredElement(data);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setFirstContext("element");
              setHoveredElement(data);
              handleContextMenu(e, data);
            }}
            // title={data.description}
            onClick={handleClick}
            className="risk-object-container panningDisabled pinchDisabled wheelDisabled "
            style={{
              border: selectedElements.find((element) => element.id === data.id)
                ? "5px solid #EE0000"
                : data["position.enabled"]
                ? data.type === "physical"
                  ? "5px solid rgb(89, 117, 209)"
                  : data.type === "model"
                  ? "5px solid #CD6600"
                  : "5px solid #8B008B"
                : "5px solid grey",
              borderRadius: "15px",
              backgroundColor: "white",
              padding: "5px",
              overflow: "hidden",
              zIndex: data.zIndex | 2,
            }}
          >
            {view === "open" /*&& data['position.enabled'] */ && (
              <OpenFace
              updateSelectedFace={updateSelectedFace}
                chartIndex={chartIndex}
                showChartsWindow={showChartsWindow}
                setShowChartsWindow={setShowChartsWindow}
                setChartIndex={setChartIndex}
                charts={charts.filter(
                  (chart) => chart.riskObjectId === String(data.id)
                )}
                data={data}
                groupId={groupIdState}
                setView={setView}
                handleObjectProperty={handleObjectProperty}
                updateSelectedChart={updateSelectedChart}
              />
            )}
            {view === "full" /*&& data['position.enabled']*/ && (
              <ClosedFace
              updateSelectedFace={updateSelectedFace}
                editRiskObject={editRiskObject}
                data={data}
                groupId={groupIdState}
                setView={setView}
                setEditor={setEditor}
                handleObjectAction={handleObjectAction}
                setFirstContext={setFirstContext}
                setShowProperties={setShowProperties}
                showProperties={showProperties}
                handleProperties={handleProperties}
                removeFromGroup={removeFromGroup}
                setGroupIdState={setGroupIdState}
                handleObjectProperty={handleObjectProperty}
                groups={groups}
                addToGroup={addToGroup}
                shared={shared}
              />
            )}
            {/* {!data['position.enabled'] && } */}
          </div>
        ) : null}
      </Rnd>
      {/* <div style={{position:"relative",zIndex:"99999999",top:(drag.cx+230)}}>
      {true && <ClosedEitor />}
    </div> */}
    </>
  );
};
