import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export const ClosedEitor = ({ data, groupId, setFace }) => {
  return (
    <div style={{border:"1px solid grey",borderRadius:"15px",paddingTop:"10px"}}>
      <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
      />
    </div>
  );
};
