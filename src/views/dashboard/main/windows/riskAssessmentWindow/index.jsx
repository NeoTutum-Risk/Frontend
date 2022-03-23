import {
  Intent,
  Spinner,
  Switch,
  Icon,
  Menu,
  MenuDivider,
  Classes,
  MenuItem,
  H5,
  FormGroup,
  InputGroup,
  Button
} from "@blueprintjs/core";
// import { Classes } from '@blueprintjs/popover2'
import { useCallback, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { getRiskAssessment, addRiskObjectProperties } from "../../../../../services";
import { showDangerToaster, showSuccessToaster } from "../../../../../utils/toaster";
import { Window } from "../window";
import { RiskAssessment } from "../../../../../components/riskAssessment";
export const RiskAssessmentWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [isServiceLoading, setIsServiceLoading]=useState(false);
  const [newRiskObjectVal1, setNewRiskObjectVal1]=useState(null);
  const [newRiskObjectVal1Error, setNewRiskObjectVal1Error]=useState(false);
  const [newRiskObjectVal2, setNewRiskObjectVal2]=useState(null);
  const [newRiskObjectVal2Error, setNewRiskObjectVal2Error]=useState(false);
  const [contextMenu, setContextMenu] = useState({
    active: false,
    type: "",
    x: 0,
    y: 0,
    element: null,
  });
  const [riskObjects, setRiskObjects] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const riskAssessmentData = useCallback(async () => {
    const response = await getRiskAssessment(window.data.id);
    if (response.status === 200) {
      setRiskObjects(response.data.data.riskObjects);
      setMetaData(response.data.data.metaData.referenceGroupJsons[0].json);
    } else {
      showDangerToaster(`Error Retrieving Risk Assessment Data`);
    }
  }, [window.data.id]);

  const contextMenuAction = useCallback(async (path) => {
    try{
      setContextMenu((prev) => ({ ...prev, type: "loading"}));
      const response = await addRiskObjectProperties(contextMenu.element,{dataObjectElements:path});
      if(response.status===200){
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          element: null,
        });
      }else{
        setContextMenu({
          active: false,
          type: "",
          x: 0,
          y: 0,
          element: null,
        });
      }
      showSuccessToaster(`Successfully Added Properties to Risk Object ${contextMenu.element}`);
    }catch(er){
      showDangerToaster(`Failed Adding Properties to Risk Object ${contextMenu.element}`);
      showDangerToaster(er);
      setContextMenu({
        active: false,
        type: "",
        x: 0,
        y: 0,
        element: null,
      });
    }
    

    
  }, [contextMenu.element]);

  useEffect(() => {
    riskAssessmentData();
  }, [riskAssessmentData]);
  const getChildren = useCallback(
    (object) => {
      return object?.children.length > 0 ? (
        <MenuItem MenuItem text={object.name}>
          {object.children.map((subObject) => getChildren(subObject))}
        </MenuItem>
      ) : object.path ? (
        <MenuItem
          text={object.name}
          onClick={() => contextMenuAction(object.path)}
        />
      ) : (
        <MenuItem text={object.name} />
      );
    },
    [contextMenuAction]
  );
  const menu = metaData.map((l1) => {
    return (
      <MenuItem text={l1.name}>
        {l1.metaDataLevel2.map((l2) => {
          console.log(l2);
          return (
            <MenuItem text={l2.name}>
              {l2.dataObjects[0]?.children
                ? l2.dataObjects[0].children.map((l1Do) => getChildren(l1Do))
                : null}
            </MenuItem>
          );
        })}
      </MenuItem>
    );
  });

  const handleContextMenu = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(e);
      setContextMenu((prev) => ({
        active: true,
        type: "context",
        x: e.target.offsetLeft + 50,
        y: e.target.offsetTop + 70,
        element: Number(e.target.id),
      }));
    },
    [setContextMenu]
  );

  const addPhysicalObjectLookup = useCallback(async()=>{

  },[])
  return (
    <>
      <Window
        // title={window.data.fileName}
        window={window}
        icon="diagram-tree"
        onClose={onClose}
        onCollapse={onCollapse}
        onRestore={onRestore}
        onTypeChange={onTypeChange}
        collapseState={collapseState}
        title={window.data.name}
      >
        {(contextMenu.active && contextMenu.type==="loading") && (
        <div key='text' style={{
          zIndex: 10000000000,
          position: "absolute",
          backgroundColor: "#30404D",
          color:"white",
          top: "25%",
          left: "25%",
          padding:"10px",
          borderRadius:"2px"
        }}>
        <H5 style={{color:"white"}}>Add Physical Object Properties</H5>
        
      </div>
      )}
        <RiskAssessment
          objects={riskObjects}
          metaData={metaData}
          riskAssessmentId={window.data.id}
          handleContextMenu={handleContextMenu}
        />
      </Window>
      <div
        className=""
        style={{
          zIndex: 10000000000,
          fontSize: "10px",
          position: "absolute",
          top: contextMenu.y,
          left: contextMenu.x,
        }}
      >
        {contextMenu.active && contextMenu.type === "context" && (
          <Menu className={` ${Classes.ELEVATION_1}`}>{menu}</Menu>
        )}


      </div>
    </>
  );
};
