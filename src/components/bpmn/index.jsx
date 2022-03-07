import { Button, ButtonGroup } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import BpmnModeler from "bpmn-js/lib/Modeler";
import minimapModule from "diagram-js-minimap";
import { memo, useCallback, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

export const Bpmn = memo(({ xml = "", onChange, onClick }) => {
  const [modeler, setModeler] = useState(null);
  const { width, height, ref: modelerRef } = useResizeDetector();

  const resizeBpmn = useCallback(() => {
    if (!modeler) return;
    modeler.get("canvas").zoom("fit-viewport", "auto");
  }, [modeler]);

  const downloadBpmn = useCallback(async() => {
    if (!modeler) return;
    const { xml } = await modeler.saveXML({format:true});
    let link = document.createElement("a");
    let url = encodeURIComponent(xml);
    let bb = new Blob([xml], {type: 'text/plain'});
    link.setAttribute("download", "diagram.bpmn");
    link.setAttribute("href", window.URL.createObjectURL(bb));
    document.body.appendChild(link); // Required for FF
    link.click();
  }, [modeler]);

  const downloadSvg = useCallback(async() => {
    if (!modeler) return;
    const { svg } = await modeler.saveSVG();
    let link = document.createElement("a");
    let url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
    link.setAttribute("download", "diagram.svg");
    link.setAttribute("href", url);
    document.body.appendChild(link); // Required for FF
    link.click();
  }, [modeler]);

  const onChangeHandler = useCallback(async () => {
    if (!modeler) return;

    const { xml } = await modeler.saveXML({ format: true });
    onChange(xml);
  }, [modeler, onChange]);

  const onClickHandler = useCallback(async (event) => {
    if (!modeler) return;

    onClick(event);
  }, [modeler, onClick]);

  useEffect(() => {
    if (!modeler || !xml) return;

    modeler
      .importXML(xml)
      .then(() => resizeBpmn())
      .catch((error) => alert(error));
  }, [modeler, resizeBpmn, xml]);

  useEffect(() => {
    resizeBpmn();
  }, [width, height, resizeBpmn]);

  useEffect(() => {
    if (!modeler) return;

    modeler.on('element.click', onClickHandler);

    modeler.on("commandStack.changed", onChangeHandler);

    return () => {
      modeler.off("commandStack.changed", onChangeHandler);
    };
  }, [modeler, onChangeHandler,onClickHandler]);

  useEffect(() => {
    setModeler(
      new BpmnModeler({
        container: modelerRef.current,
        additionalModules: [minimapModule],
      })
    );

    document.getElementsByClassName("djs-container")[0].style.overflow =
      "visible";

    document.getElementsByClassName("djs-container")[0].style.overflow = "visible";

    return () => {
      modelerRef.current = null;
    };
  }, [modelerRef]);

  const onZoomOut = useCallback(() => {
    if (!modeler) return;

    const scale = modeler.get("canvas").viewbox().scale;

    modeler.get("canvas").zoom(scale - 0.1, true);
  }, [modeler]);
  const onZoomIn = useCallback(() => {
    if (!modeler) return;
    const scale = modeler.get("canvas").viewbox().scale;

    modeler.get("canvas").zoom(scale + 0.1, true);
  }, [modeler]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          flexDirection: "column",
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 19,
          right: 20,
          bottom: "10%",
        }}
      >
        <ButtonGroup vertical>
          <Tooltip2 content={<span>Download as BPMN</span>}>
            <Button onClick={downloadBpmn} icon="import" />
          </Tooltip2>
          <Tooltip2 content={<span>Download as SVG</span>}>
            <Button onClick={downloadSvg} icon="cloud-download" />
          </Tooltip2>
          <Tooltip2 content={<span>Zoom To Fit</span>}>
            <Button onClick={resizeBpmn} icon="zoom-to-fit" />
          </Tooltip2>
          <Tooltip2 content={<span>Zoom In</span>}>
            <Button onClick={onZoomIn} icon="plus" />
          </Tooltip2>
          <Tooltip2 content={<span>Zoom Out</span>}>
            <Button onClick={onZoomOut} icon="minus" />
          </Tooltip2>
        </ButtonGroup>
      </div>
      <div ref={modelerRef} style={{position:"absolute",marginLeft:"70px",width: 'calc(100% - 70px)', height: '100%' }} />

      <div
        ref={modelerRef}
        style={{
          position: "absolute",
          marginLeft: "80px",
          width: "calc(100% - 80px)",
          height: "100%",
        }}
      />

    </div>
  );
});
