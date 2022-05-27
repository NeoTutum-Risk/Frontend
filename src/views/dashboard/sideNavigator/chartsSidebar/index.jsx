import { Tree } from "@blueprintjs/core";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeDashboardPanelState, showDashboardState } from "../../../../store/dashboard";

const ChartsSidebar = () => {

    const setActiveDashboardPanelState = useSetRecoilState(activeDashboardPanelState)
    const [showDashboard, setShowDashboard] = useRecoilState(showDashboardState);

  // Sample Tree Data
  const sampleData = [
    {
      id: 0,
      hasCaret: true,
      label: "L0",
      name: "l0"
    }
  ];

  const nodeHandler = (e) => {

    if(showDashboard !== "charts") setShowDashboard("charts")

    setActiveDashboardPanelState(e.name)
  }

  return <Tree contents={sampleData} onNodeClick={nodeHandler} />;
};

export default ChartsSidebar;
