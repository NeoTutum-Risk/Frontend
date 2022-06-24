import { Button, ButtonGroup } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import BpmnModeler from "bpmn-js/lib/Modeler";
import minimapModule from "diagram-js-minimap";
import { memo, useCallback, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { useRecoilState } from "recoil";
import { checkDeletedPhysicalDataObj } from "../../services";
import { BPMNLayerState } from "../../store/windows";
import { showDangerToaster } from "../../utils/toaster";

export const Bpmn = memo(
  ({
    xml = "",
    onChange,
    onClick,
    onContextMenu,
    bpmnId,
    modeler,
    setModeler,
  }) => {
    const { width, height, ref: modelerRef } = useResizeDetector();
    const [BPMNLayers, setBPMNLayers] = useRecoilState(BPMNLayerState);

    const resizeBpmn = useCallback(() => {
      if (!modeler) return;
      modeler.get("canvas").zoom("fit-viewport", "auto");
    }, [modeler]);

    /**
     * @description handles the check the deleted physical risk Objects and updates label
     */
    const checkDelPhysicalRiskObjects = useCallback(async () => {
      try {
        const response = await checkDeletedPhysicalDataObj(bpmnId);

        if (response.status === 200) {
          const deletedPhysicalDataObjArr = response.data.data;
          console.log(deletedPhysicalDataObjArr);
          const existingElements = modeler
            .get("elementRegistry")
            .filter(
              (el) =>
                el.type === "bpmn:TextAnnotation" &&
                deletedPhysicalDataObjArr.some(
                  (phsyicalDataObj) =>(
                    (phsyicalDataObj.id.toString() ===
                    el.businessObject.$attrs.physicalDataObjectId) && !(el.businessObject.text.substring(0,3) === "DEL")
                  )
                )
            );

            if(existingElements.length === 0) return

            for(let existingElement of existingElements){
              const prevText = existingElement.businessObject.text
              modeler.get("modeling").updateProperties(existingElement, {text: `DEL\n${prevText}`})
            }
          //const prevText = element.businessObject.text
        } else {
          showDangerToaster("Error in checking deleted physical Data Objects");
        }
      } catch (error) {
        showDangerToaster(
          `Error in checking deleted physical Data Objects: ${error}`
        );
      }

      //modeler.get("modeling").updateProperties(element, {text: prevText})
    }, [modeler]);

    const onChangeHandler = useCallback(async () => {
      if (!modeler) return;

      if (
        BPMNLayers.find((bpmn) => bpmn.id === bpmnId).currentBPMN !==
        modeler.get("canvas").getRootElement().id
      ) {
        setBPMNLayers((bpmns) => {
          return bpmns.map((bpmn) => {
            if (bpmn.id !== bpmnId) return bpmn;

            return {
              id: bpmnId,
              currentLayer: modeler.get("canvas").getRootElement().id,
            };
          });
        });
      }

      const { xml } = await modeler.saveXML({ format: true });
      onChange(xml);
    }, [modeler, onChange]);

    const onClickHandler = useCallback(
      async (event) => {
        if (!modeler) return;

        onClick(event);
      },
      [modeler, onClick]
    );

    const onRightClickHandler = useCallback(
      (event) => {
        event.preventDefault();
        if (!modeler) return;

        onContextMenu(event);
      },
      [modeler, onContextMenu]
    );

    useEffect(() => {
      if (!modeler || !xml) return;

      let currentBPMN = BPMNLayers.find((bpmn) => bpmn.id === bpmnId);

      if (BPMNLayers.length === 0 || !currentBPMN) {
        const newBPMN = { id: bpmnId, currentLayer: "new_file" };
        setBPMNLayers([...BPMNLayers, newBPMN]);
        currentBPMN = newBPMN;
      }

      modeler
        .importXML(xml)
        .then(() => {
          resizeBpmn();
          if (
            currentBPMN.currentLayer !==
            modeler.get("canvas").getRootElement().id
          ) {
            modeler
              .get("canvas")
              .setRootElement(
                modeler.get("elementRegistry").get(currentBPMN.currentLayer)
              );
          }
          checkDelPhysicalRiskObjects();
        })
        .catch((error) => alert(error));
    }, [modeler, resizeBpmn, xml]);

    useEffect(() => {
      resizeBpmn();
    }, [width, height, resizeBpmn]);

    useEffect(() => {
      if (!modeler) return;

      modeler.on("element.click", onClickHandler);

      modeler.on("element.contextmenu", onRightClickHandler);

      modeler.on("commandStack.changed", onChangeHandler);

      return () => {
        modeler.off("commandStack.changed", onChangeHandler);
      };
    }, [modeler, onChangeHandler, onClickHandler, onRightClickHandler]);

    useEffect(() => {
      setModeler(
        new BpmnModeler({
          container: modelerRef.current,
          additionalModules: [minimapModule],
        })
      );

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

    const downloadBpmn = useCallback(async () => {
      if (!modeler) return;
      const { xml } = await modeler.saveXML({ format: true });
      let link = document.createElement("a");
      let url = encodeURIComponent(xml);
      let bb = new Blob([xml], { type: "text/plain" });
      link.setAttribute("download", "diagram.bpmn");
      link.setAttribute("href", window.URL.createObjectURL(bb));
      document.body.appendChild(link); // Required for FF
      link.click();
    }, [modeler]);

    const downloadSvg = useCallback(async () => {
      if (!modeler) return;
      const { svg } = await modeler.saveSVG();
      let link = document.createElement("a");
      let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      link.setAttribute("download", "diagram.svg");
      link.setAttribute("href", url);
      document.body.appendChild(link); // Required for FF
      link.click();
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
  }
);
