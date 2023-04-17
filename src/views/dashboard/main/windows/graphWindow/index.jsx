import { Intent, Spinner, Switch, Menu, MenuItem, H5,FormGroup,InputGroup,Button,TextArea } from "@blueprintjs/core";
import { Classes } from '@blueprintjs/popover2'
import { useCallback, useState } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import { Bpmn } from "../../../../../components/bpmn";
import { updateBpmnStatus, addNewRiskObject } from "../../../../../services";
import { platformState } from "../../../../../store/portfolios";
import { elementSelectorState } from "../../../../../store/elementSelector";
import { showDangerToaster, showSuccessToaster } from "../../../../../utils/toaster";
import { Window } from "../window";
import { windowFamily, windowsIds, windowsState } from "../../../../../store/windows";
import { getBpmnSequenceFlows, getBpmnEntities } from "../../../../../services";
export const GraphWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [windows, setWindows] = useRecoilState(windowsState);
  const [bpmn, setbpmn] = useRecoilState(platformState(window.data.id));
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveLoading, setAutoSaveLoading] = useState(false);
  const [newPhysicalObjectNameError, setNewPhysicalObjectNameError] = useState(null);
  const [newPhysicalObjectName,setNewPhysicalObjectName] = useState(null);
  const [isAddPhysicalObjectLoading,setIsAddPhysicalObjectLoading] = useState(false);
  const [objectDescription, setObjectDescription] = useState(null);
  const [objectDescriptionError, setObjectDescriptionError] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    active: false,
    type:"",
    x: 0,
    y: 0,
    element: null,
    modeler: null
  });
  const [elementSelector, setElementSelector] =
    useRecoilState(elementSelectorState);
  const [modeler, setModeler] = useState(null)

  /**
   * 
   * @param {Element Registry} dataObjectReference 
   * @param {String} text 
   * 
   * creates text annotation and appends it to the file
   */
  const appendTextAnnotation = (dataObjectReference, text, physicalDataObjectId) => {
    const textAnnotation = modeler.get("elementFactory").createShape({
      type: 'bpmn:TextAnnotation',
      businessObject: modeler.get("bpmnFactory").create('bpmn:TextAnnotation', {
        text,
        physicalDataObjectId,
      })
    });
    modeler.get("modeling").appendShape(dataObjectReference, textAnnotation)
  }

  const handleContextMenu = useCallback(
    async (e) => {
      e.preventDefault();
      if (e.element.type !== "bpmn:DataObjectReference") return;
      if (contextMenu.active) return;
      setContextMenu((prev) => ({
        active: true,
        type:"context",
        x: e.originalEvent.layerX,
        y: e.originalEvent.layerY,
        element:e.element.id
      }));
    },
    [setContextMenu, contextMenu]
  );

  const elementSelectorHandler = useCallback(
    (data) => {
      setContextMenu((prev) => ({ ...prev, active: false, element: null }));
      const elementId = data.element.id;
      const type = data.element.type;
      if (!elementId) return;
      if (type === "process") {
        setElementSelector(null);
      } else {
        setElementSelector({ elementId, type, fileId: window.data.id });
      }
    },
    [setElementSelector, window.data.id]
  );
  const saveBpmn = useCallback(
    async (fileData) => {
      try {
        setAutoSaveLoading(true);

        await updateBpmnStatus({
          id: window.data.id,
          status: "changed",
          fileData,
        });
        setAutoSaveLoading(false);
      } catch (error) {
        setAutoSaveLoading(false);
        showDangerToaster(error?.response?.data?.msg ?? error.message);
      }
    },
    [window]
  );

  const setOtherWindows = useRecoilCallback(
    ({ set, snapshot }) =>
      async (sequenceFlows, entities) => {
        const windowsIdsList = await snapshot.getPromise(windowsIds);
        for (const windowId of windowsIdsList) {
          const window = await snapshot.getPromise(windowFamily(windowId));

          if (window.data.type === "BPMN SequenceFlows") {
            set(windowFamily(windowId), {
              ...window,
              data: {
                type: "BPMN SequenceFlows",
                sequenceFlows: sequenceFlows.data.data,
              },
            });
          }

          if (window.data.type === "BPMN Entities") {
            set(windowFamily(windowId), {
              ...window,
              data: {
                type: "BPMN Entities",
                entities: entities.data.data,
              },
            });
          }
        }
      },
    []
  );

  const handleOnChange = useCallback(
    async (data) => {
      setContextMenu((prev) => ({ ...prev, active: false, element: null }));
      setbpmn({ xml: data, changed: !autoSave });
      if (autoSave) {
        saveBpmn(data);
      }
      setTimeout(async () => {
        const sequenceFlows = await getBpmnSequenceFlows();
        const entities = await getBpmnEntities();

        setOtherWindows(sequenceFlows, entities);
      }, 500);
    },
    [autoSave, saveBpmn, setbpmn, /*setWindows*/ , setOtherWindows]
  );

  const contextMenuAction = useCallback( () => {
    setContextMenu(prev=>({...prev,type:"form"}))
  },[]);

  const addPhysicalObject = useCallback(async (e)=>{
    e.preventDefault();
    try{
      setIsAddPhysicalObjectLoading(true);
      const payload= {
        bpmnDataObjectId:contextMenu.element,
        fileId:window.data.id,
        type:"physical",
        name:newPhysicalObjectName,
        description:objectDescription,
        level:0,
      }
  
      const response = await addNewRiskObject(payload);
  
      if(response.status >= 200 && response.status<300){
        setIsAddPhysicalObjectLoading(false);

        // do the coloring of the data reference object
        const BPMNphysicalDataObject = modeler.get('elementRegistry').get(contextMenu.element)
        const physicalDataObjectId = response.data.data.id
        const physicalDataObjectName = response.data.data.name
        const textAppended = `id: ${physicalDataObjectId}\nname: ${physicalDataObjectName}`
        appendTextAnnotation(BPMNphysicalDataObject, textAppended, physicalDataObjectId)
        modeler.get("modeling").setColor([BPMNphysicalDataObject], {stroke: '#2C5E1A',fill: '#B2D2A4'})
        setContextMenu(prev=>({...prev,active:false,element:null}));
        showSuccessToaster(`Risk Object Created Successfully`);
      }else{
        setIsAddPhysicalObjectLoading(false);
        showDangerToaster('Unable to Create Risk Object')
      }
    }catch(er){
      setIsAddPhysicalObjectLoading(false);
      showDangerToaster(`Unable to Create Risk Object ${er}`);
    }
    
  },[contextMenu.element,window.data.id,newPhysicalObjectName,objectDescription])
  return (
    <Window
      title={window.data.fileName}
      window={window}
      icon="document"
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onRestore}
      onTypeChange={onTypeChange}
      collapseState={collapseState}
      headerAdditionalContent={
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Switch
            checked={autoSave}
            style={{ marginBottom: 0 }}
            label="Auto Save"
            onChange={() => setAutoSave((prevAutoSave) => !prevAutoSave)}
          />
          {autoSaveLoading && <Spinner size={12} intent={Intent.PRIMARY} />}
        </div>
      }
    >
      {(contextMenu.active && contextMenu.type==="context") && (
        <Menu>
          <MenuItem
            style={{
              zIndex: 10000000000,
              position: "absolute",
              backgroundColor: "#BFCCD6",
              top: contextMenu.y,
              left: contextMenu.x,
            }}
            icon="document"
            text="Create Physical Risk Object"
            onClick={contextMenuAction}
          />
        </Menu>
      )}
      {(contextMenu.active && contextMenu.type==="form") && (
        <div key='text' style={{
          zIndex: 10000000000,
          position: "absolute",
          backgroundColor: "#30404D",
          color:"white",
          top: contextMenu.y,
          left: contextMenu.x,
          padding:"10px",
          borderRadius:"2px"
        }}>
        <H5 style={{color:"white"}}>Add New Physical Object</H5>
        <form onSubmit={addPhysicalObject}>
          <FormGroup
            label='Name'
            labelInfo='(required)'
            intent={newPhysicalObjectNameError ? Intent.DANGER : Intent.NONE}
            helperText={newPhysicalObjectNameError}
            labelFor='newPhysicalObjectName'
          >
            <InputGroup
              required
              id='newPhysicalObjectName'
              onChange={event => {
                setNewPhysicalObjectNameError(false)
                setNewPhysicalObjectName(event.target.value)
              }}
            />
          </FormGroup>
          <FormGroup
                label="Description"
                labelInfo="(required)"
                intent={objectDescriptionError ? Intent.DANGER : Intent.NONE}
                helperText={objectDescriptionError}
                labelFor="newObjectDescription"
              >
                <TextArea
                  // required
                  id="newObjectDescription"
                  onChange={(event) => {
                    setObjectDescriptionError(null);
                    setObjectDescription(event.target.value);
                  }}
                />
              </FormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <Button
              className={Classes.POPOVER2_DISMISS}
              disabled={isAddPhysicalObjectLoading}
              style={{ marginRight: 10 }}
              onClick={() => {
                setNewPhysicalObjectNameError(false)
                setContextMenu(prev=>({...prev,active:false,element:null}))
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              loading={isAddPhysicalObjectLoading}
              intent={Intent.SUCCESS}
              className={Classes.POPOVER2_DISMISS}
              // onClick={addPortfolio}
            >
              Add
            </Button>
          </div>
        </form>
      </div>
      )}
      <Bpmn
        xml={bpmn.xml ?? window.data.fileData}
        bpmnId={window.data.id}
        onChange={handleOnChange}
        onClick={(data) => elementSelectorHandler(data)}
        onContextMenu={handleContextMenu}
        modeler={modeler}
        setModeler={setModeler}
      />
    </Window>
  );
};
