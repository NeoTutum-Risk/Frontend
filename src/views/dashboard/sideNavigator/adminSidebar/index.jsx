import {
  Tree,
} from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { activeDashboardPanelState } from "../../../../store/dashboard";
import DownloadRiskAssessmentJSON from "../../../../components/downloadRiskAssessmentJSON";
import JSONUploadAnalyticsPack from  "../../../../components/upload-analysis-packs";
import JSONProcessStep1Test from "../../../../components/JSONProcessStep1Test";

const AdminSidebar = () => {
  const setActiveDashboardPanelState = useSetRecoilState(
    activeDashboardPanelState
  );

  const navigate = useNavigate();

  // Sample Tree Data
  const sampleData = [
    {
      id: 0,
      hasCaret: false,
      label: "Risk Object Meta Data",
      name: "meta-data",
    },
    {
      id: 1,
      hasCaret: false,
      label: "Look-up",
      name: "look-up",
    },
    {
      id: 2,
      hasCaret: false,
      label: "Data Objects",
      name: "Data Objects",
    },
    {
      id: 3,
      hasCaret: false,
      label: "Analysis Packs Run Files",
      name: "Analysis Packs Run Files",
    },
    {
      id: 4,
      hasCaret: false,
      label: (
        <JSONProcessStep1Test />
      ),
      name: "JSON-process-step-1-test",
    },
    {
      id: 5,
      hasCaret: false,
      label: (
        <DownloadRiskAssessmentJSON />
      ),
      name: "download-risk-assessment-json",
    },
    {
      id: 6,
      hasCaret: false,
      label: (
        <JSONUploadAnalyticsPack />
      ),
      name: "Upload JSON Analysis Packs",
    },
  ];

  const nodeHandler = (e) => {
    setActiveDashboardPanelState(e.name);
  };

  return <Tree contents={sampleData} onNodeClick={nodeHandler} />;
};

export default AdminSidebar;
