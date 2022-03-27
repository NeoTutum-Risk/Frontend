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
      hasCaret: true,
      label: "Risk Object Meta Data",
      name: "meta-data"
    },
    {
      id: 1,
      hasCaret: true,
      label: "Look-up",
      name: "look-up"
    },
  ];

  const nodeHandler = (e) => {
    setActiveAdminPanelState(e.name)
  }

  return <Tree contents={sampleData} onNodeClick={nodeHandler} />;
};

export default AdminSidebar;
