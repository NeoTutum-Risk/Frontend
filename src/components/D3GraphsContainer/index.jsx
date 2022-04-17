import { useEffect, useState } from "react";
import D3ConnectedScatter from "../D3ConnectedScatter";
import D3DrillDown from "../D3DrillDown";
import D3HeatMap from "../D3HeatMap";
import D3TreeMap from "../D3TreeMap";
import classes from "./D3GraphsContainer.module.css";
import {
  continentDummyData,
  heatmapDummyData,
  DUMMY_DATA,
  treeMapDummyData,
  connectedScatterDummyData,
} from "./dummyData";

// Labels of row and columns of heat map
const heatmapXLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const heatmapYLabels = [
  "v1",
  "v2",
  "v3",
  "v4",
  "v5",
  "v6",
  "v7",
  "v8",
  "v9",
  "v10",
];

const heatmapRules = [
  { minValue: 1, maxValue: 30, hexColorCode: "#00af50" },
  { minValue: 31, maxValue: 60, hexColorCode: "#ffff01" },
  { minValue: 61, maxValue: 90, hexColorCode: "#ed7d31" },
  { minValue: 91, maxValue: 120, hexColorCode: "#f50101" },
  { minValue: 121, maxValue: 150, hexColorCode: "#7030a0" }
];

const D3GraphsContainer = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedDummyData, setSelectedDummyData] = useState(DUMMY_DATA);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  useEffect(() => {
    if (selectedPlatform) {
      setSelectedDummyData(
        DUMMY_DATA.filter(
          (dummyData) => dummyData.continent === selectedPlatform
        )
      );
    }
  }, [selectedPlatform]);

  const handleSelectedElements = (selectedData) => {
    if (!selectedData.children) return;
    setSelectedDummyData(selectedData.children);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.graphContainer}>
        <D3HeatMap
          heatmapDummyData={heatmapDummyData}
          continentDummyData={continentDummyData}
          setSelectedPlatforms={setSelectedPlatforms}
          xLabels={heatmapXLabels}
          yLabels={heatmapYLabels}
          rules={heatmapRules}
          defaultHexColorCode="#000000"
        />

        <D3DrillDown
          drillDownDummyData={selectedDummyData}
          handleSelectedElements={handleSelectedElements}
        />

        <D3TreeMap treeMapDummyData={treeMapDummyData} />

        <D3ConnectedScatter
          connectedScatterDummyData={connectedScatterDummyData}
        />
      </div>
    </div>
  );
};

export default D3GraphsContainer;
