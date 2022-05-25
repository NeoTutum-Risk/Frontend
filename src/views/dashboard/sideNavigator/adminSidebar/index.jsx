import { Tree } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { activeAdminPanelState } from "../../../../store/admin";

const AdminSidebar = () => {

    const setActiveAdminPanelState = useSetRecoilState(activeAdminPanelState)

    const navigate = useNavigate();

  // Sample Tree Data
  const sampleData = [
    {
      id: 0,
      hasCaret: false,
      label: "Risk Object Meta Data",
      name: "meta-data"
    },
    {
      id: 1,
      hasCaret: false,
      label: "Look-up",
      name: "look-up"
    },
    {
      id: 2,
      hasCaret: false,
      label: "Data Objects",
      name: "Data Objects"
    }
  ];

  const nodeHandler = (e) => {
    setActiveAdminPanelState(e.name)
  }

  return <Tree contents={sampleData} onNodeClick={nodeHandler} />;
};

export default AdminSidebar;
