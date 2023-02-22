import { useCallback, useState } from "react";
import { RiskElement } from "./riskElement";
import { DataObject } from "./dataObject";
import  "./visualObject.css"
import { Rnd } from "react-rnd";
import {
  Button,
  ButtonGroup,
  TextArea,
  FormGroup,
  FileInput,
  Slider,
  InputGroup,
  NumericInput,
  HTMLSelect
} from "@blueprintjs/core";
import "./dataElement.css";
// import { Tooltip } from "./dataElementTooltip";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { editVisualObject } from "../../services";
import { showDangerToaster } from "../../utils/toaster";
import { trim } from "lodash";
export const VisualObject = ({
  visualObjectEdit,
  data,
  enviroDimension,
  riskAssessmentId,
  scale,
  setFirstContext,
  handleContextMenu,
  setHoveredElement,
  handleVOEdit,
  handleVODelete,
}) => {
  // (data.id)
  // const updateXarrow = useXarrow();
  const [color,setColor] = useState(String(data.color).slice(0,7));
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [editText, setEditText] = useState(false);
  const [objectText, setObjectText] = useState(data.text);
  const [objectFile, setObjectFile] = useState(null);
  const [objectFont, setObjectFont] = useState(data.font | 24);
  
  const [border, setBorder] = useState(data.border | 0);
  const [edit, setEdit] = useState(false);
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
      const updateElementPosition = await editVisualObject(data.id, {
        x: Math.round(d.x),
        y: Math.round(d.y),
        expanded: data.currentExpanded,
      });
    },
    [data.id, data.currentExpanded, enviroDimension]
  );

  const handleEdit = useCallback(async () => {
    setIsServiceLoading(true);
    const response = await handleVOEdit(data.id, {
      objectFont,
      objectText,
      objectFile,
      color,
      border
    });
    if (response) {
      setEdit(false);
    }
    setIsServiceLoading(false);
  }, [data.id, objectFont, objectText, objectFile, handleVOEdit,border,color]);

  const handleDelete = useCallback(async () => {
    setIsServiceLoading(true);
    const response = await handleVODelete(data.id);
    if (response) {
      setEdit(false);
    }
    setIsServiceLoading(false);
  }, [data.id, handleVODelete]);

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

      const updateOjectPosition = await editVisualObject(data.id, {
        x: Math.round(position.x),
        y: Math.round(position.y),
        width: w,
        height: h,
      });
    },
    [data, size]
  );

  const handleClick = useCallback((e) => {
    console.log("in");
    e.preventDefault();
    if (e.detail === 2) setEdit((prev) => !prev);
    // visualObjectEdit(e,data)
    // console.log("A7A")
  }, []);

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
        id={`vo-${data.modelGroup ? "M" : ""}${riskAssessmentId}-${data.id}`}
        key={`vo-${riskAssessmentId}-${data.id}`}
        default={{
          x: drag.cx,
          y: drag.cy,
          width: edit?"auto":size.w,
          height: edit?"auto":size.h,
        }}
        position={{
          x: drag.cx,
          y: drag.cy,
        }}
        size={{
          width: edit?"auto":size.w,
          height: edit?"auto":size.h,
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
        style={{zIndex:edit?9999: data.zIndex | 5}}
      >
        <div
          onMouseLeave={() => setFirstContext("main")}
          onMouseEnter={() => {
            setFirstContext("visualObject");
            setHoveredElement(data);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenu(e, data);
          }}
          className="risk-object-container panningDisabled pinchDisabled wheelDisabled "
          style={{
            border: edit? `${border>0?border:1}px solid grey`:border>0?`${border}px solid grey`:"",
            backgroundColor: color,
            color: "black",
            padding: "5px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            overflow: edit ? "auto" : "hidden"
          }}
        >
          {data.text && edit ? (
            <FormGroup
              label=""
              labelFor="vot"
              className="panningDisabled pinchDisabled wheelDisabled "
              style={{height:"100%" }}
            >
              <TextArea
                className="panningDisabled pinchDisabled wheelDisabled "
                fill={true}
                id="vot"
                defaultValue={objectText}
                style={{ fontSize: `${objectFont}px`,height:"100%"}}
                onChange={(event) => {
                  setObjectText(event.target.value);
                }}
              />
            </FormGroup>
          ) : (
            <p style={{textAlign:"left", fontSize: `${objectFont}px` }} onClick={handleClick}>
              {objectText}
            </p>
          )}
          {edit ? (
              <FormGroup
                className="panningDisabled pinchDisabled wheelDisabled "
                label={`Image`}
                labelFor="imvo"
              >
                <FileInput
                  className="panningDisabled pinchDisabled wheelDisabled "
                  fill={true}
                  hasSelection={objectFile}
                  text={objectFile?.name ? objectFile?.name : "Choose file..."}
                  onInputChange={(e) => {
                    setObjectFile(e.target.files[0]);
                  }}
                ></FileInput>
              </FormGroup>
            ) : data.filePath &&
            (
              <div
                className="panningDisabled pinchDisabled wheelDisabled "
                style={{
                  // width: "100%",
                  // height: "auto",
                  // marginTop: "5px",
                  overflow: "auto",
                }}
                onClick={handleClick}
              >
                <img
                  className="panningDisabled pinchDisabled wheelDisabled "
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "5px",
                    overflow: "auto",
                  }}
                  src={data.filePath}
                  alt="Error Rendering Chart"
                />
              </div>
            )}
          {edit && data.text && (
            <FormGroup
              className="panningDisabled pinchDisabled wheelDisabled "
              style={{ padding: "5px" }}
              label="Font"
              labelFor="vof"
            >
              <NumericInput
                className="panningDisabled pinchDisabled wheelDisabled "
                min={24}
                max={72}
                step={4}
                fill={true}
                id="vof"
                defaultValue={objectFont}
                onValueChange={(event) => {
                  console.log(event);
                  setObjectFont(event);
                }}
              />
            </FormGroup>
          )}
          {edit && (
            <>
            <FormGroup
            label="Border"
            labelFor="border"
          >
            <NumericInput
              // required
              max={5}
              min={0}
              value={border}
              fill={true}
              id="border"
              onValueChange={(e) => {
                setBorder(e);
              }}
            />
          </FormGroup>
          <FormGroup
            label="Background Color"
            labelFor="bcg"
            >
          <HTMLSelect
          fill={true}
              id="bcg"
              defaultValue={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option selected disabled>
                Select Background Color
              </option>
              <option style={{backgroundColor:""}} value="">N/A</option>
              <option style={{backgroundColor:"#FA8072"}} value="#FA8072">Red</option>
              <option style={{backgroundColor:"#CDC9C9"}} value="#CDC9C9">Grey</option>
              <option style={{backgroundColor:"#7D9EC0"}} value="#7D9EC0">Blue</option>
              <option style={{backgroundColor:"#FCE6C9	"}} value="#FCE6C9	">Yellow</option>
              <option style={{backgroundColor:"#B4EEB4"}} value="#B4EEB4">Green</option>
              </HTMLSelect>
              </FormGroup>
              </>
          )}

          
        </div>
        {edit && (
            <div
              className="panningDisabled pinchDisabled wheelDisabled "
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 15,
                // overflow: "auto",
              }}
            >
              <Button
                disabled={isServiceLoading}
                style={{ marginRight: 10 }}
                onClick={() => {
                  setEdit(false);
                  setObjectText(data.text);
                  setObjectFile(null);
                  setObjectFont(data.font | 24);
                }}
              >
                Cancel
              </Button>
              <Button
                // type="submit"
                onClick={handleEdit}
                loading={isServiceLoading}
                intent="Success"
              >
                Add
              </Button>
              <Button
                // type="submit"
                onClick={handleDelete}
                loading={isServiceLoading}
                intent="Danger"
              >
                Delete
              </Button>
            </div>
          )}
      </Rnd>
    </>
  );
};
