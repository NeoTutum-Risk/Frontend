import { Tree } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { activeDashboardPanelState } from "../../../../store/dashboard";

const AdminSidebar = () => {

    const setActiveDashboardPanelState = useSetRecoilState(activeDashboardPanelState)

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
    },
    {
      id: 3,
      hasCaret: false,
      label: "JSON process step 1 test",
      name: "JSON-process-step-1-test"
    }
  ];

  const nodeHandler = (e) => {
    setActiveDashboardPanelState(e.name)
  }

  return <Tree contents={sampleData} onNodeClick={nodeHandler} />;
};

export default AdminSidebar;
