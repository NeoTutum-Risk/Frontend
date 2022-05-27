import {
  Menu,
  MenuItem,
  Button,
  Divider,
  Card,
  Elevation,
  Icon,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import React, { useCallback, useEffect, useState } from "react";
import {
  getAllLookup,
  getAllPortfolios,
  getRiskAssessment,
  getAllTreeMap,
} from "../../services";
import {
  getRiskAssessmentHeatMap,
  getRiskAssessmentDrillDown,
} from "../../services/index";
import D3HeatMap from "../../components/D3HeatMap";
import D3TreeMap from "../../components/D3TreeMap";
import D3DrillDown from "../../components/D3DrillDown";
import { showDangerToaster } from "../../utils/toaster";
import { heatmapDummyData } from "./heatMapDummy";
import D3ConnectedScatter from "../../components/D3ConnectedScatter";
import { graphData } from "../../components/D3ConnectedScatter/D3ConnectedScatterData";
import { useSetRecoilState } from "recoil";
import { showDashboardState } from "../../store/dashboard";
import styles from "../dashboard/styles.module.scss";

const heatmapRules = [
  { minValue: 1, maxValue: 1, hexColorCode: "#92d050" },
  { minValue: 2, maxValue: 2, hexColorCode: "#ffff00" },
  { minValue: 3, maxValue: 3, hexColorCode: "#ffc000" },
  { minValue: 4, maxValue: 4, hexColorCode: "#ff0000" },
  { minValue: 5, maxValue: 5, hexColorCode: "#7030a0" },
];

const fmodeSeverityValues = {
  NonCompliance: "1",
  Minor: "2",
  Material: "3",
  Major: "4",
  Severe: "5",
};

// Labels of row and columns of heat map

/*
const heatmapXLabels = Array.from({ length: 5 }, (_, i) => (i + 1).toString());
const heatmapYLabels = Array.from({ length: 5 }, (_, i) => (i + 1).toString());
*/

const DashboardCharts = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); // this is dummy currently for the component to not argue with us
  const [metaData, setMetaData] = useState([]);
  const [lookupData, setLookupData] = useState([]);
  const [selectedRiskType, setSelectedRiskType] = useState("all");
  const [treeMapState, setTreeMapState] = useState([]);
  const [selectedLookup, setSelectedLookup] = useState({
    propertyId: null,
    name: null,
  });
  const [dataLevel, setDataLevel] = useState([]); // array that contains the selected risk object properties that are selected in each level
  const [currentDataLevel, setCurrentDataLevel] = useState({
    name: null,
    propertyId: null,
  });
  const [selectedRiskAssessment, setSelectedRiskAssessment] = useState({
    riskAssessmentId: null,
    name: null,
    heatMap: {
      xLabels: [],
      yLabels: [],
      values: [],
    },
    drillDown: {},
  });
  const [heatmapBackground, setHeatmapBackground] = useState(heatmapDummyData);
  const setShowDashboardState = useSetRecoilState(showDashboardState);

  const riskAssessmentData = useCallback(async (riskAssessmentId) => {
    const response = await getRiskAssessment(riskAssessmentId);
    if (response.status === 200) {
      setMetaData(response.data.data.metaData.referenceGroupJsons[0].json);
    } else {
      showDangerToaster(`Error Retrieving Risk Assessment Data`);
    }
  }, []);

  useEffect(async () => {
    if (
      selectedRiskAssessment.riskAssessmentId &&
      currentDataLevel.propertyId &&
      dataLevel.length === 0
    ) {
      const { riskAssessmentId } = selectedRiskAssessment;

      const lookupPropertyId = selectedLookup.propertyId;

      try {
        const riskAssessmentHeatMap = (
          await getRiskAssessmentHeatMap({ riskAssessmentId, lookupPropertyId })
        ).data.data;

        const {
          lookUpRowsX: xLabels,
          lookUpRowsY: yLabels,
          values,
        } = riskAssessmentHeatMap;

        let bgCount = 0;
        const heatmapBgTemp = heatmapBackground.map((data, index) => {
          const i = index % xLabels.length; // index % 5

          if (i === 0 && index !== 0) bgCount++;

          return { x: xLabels[bgCount], y: yLabels[i], value: data.value };
        });

        setHeatmapBackground(heatmapBgTemp);

        const heatMap = {
          xLabels,
          yLabels,
          values,
        };

        const dataLevelpayload = [...dataLevel, currentDataLevel];
        setDataLevel(dataLevelpayload);

        const drillDown = {
          drillDown: {
            riskAssessmentId,
            dataLevel: dataLevelpayload,
          },
        };

        const riskAssessmentDrillDown = (
          await getRiskAssessmentDrillDown(drillDown)
        ).data.data;

        riskAssessmentData(riskAssessmentId);

        setSelectedRiskAssessment({
          ...selectedRiskAssessment,
          heatMap,
          drillDown: riskAssessmentDrillDown,
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [selectedRiskAssessment.riskAssessmentId, currentDataLevel.propertyId]);

  const initialLoading = useCallback(async () => {
    try {
      const portfoliosRes = await getAllPortfolios();
      const lookupRes = await getAllLookup();
      const treeMapRes = await getAllTreeMap();

      const data = portfoliosRes.data.data;
      const lookupResData = lookupRes.data.data;
      const treeMapData = treeMapRes.data.data;

      setTreeMapState(treeMapData);
      setPortfolios(data);
      setLookupData(
        lookupResData.map((lookup) => ({
          id: lookup.metaDataLevel2Id,
          name: lookup.tableName,
        }))
      );
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    initialLoading();
  }, [initialLoading]);

  // here we update the type of the current datalevel
  const handleSelectedElements = useCallback(
    async (type) => {
      // if the last datalevel is the same as the new one then return
      if (
        dataLevel[dataLevel.length - 1].propertyId ===
        currentDataLevel.propertyId
      ) {
        alert("select different risk object property");
        return;
      }

      // push the new datalevel with the data level array to prepare to send to the back-end
      let dlPayload = [...dataLevel, currentDataLevel];

      // change the last datalevel (not the new one that we just added)'s type to the selected type
      dlPayload[dlPayload.length - 2].type = type;

      // get the riskAssessment id
      const { riskAssessmentId } = selectedRiskAssessment;

      // insert the data that the endpoint is expecting
      const drillDown = {
        drillDown: {
          riskAssessmentId,
          dataLevel: dlPayload,
        },
      };

      try {
        // send the data to the backend and recieve the response
        const riskAssessmentDrillDown = (
          await getRiskAssessmentDrillDown(drillDown)
        ).data.data;

        // riskAssessmentData(riskAssessmentId); // dont know what is the use of this line but i am afraid to remove it

        // set the new drilldow data that is came from the backend
        setSelectedRiskAssessment({
          ...selectedRiskAssessment,
          drillDown: riskAssessmentDrillDown,
        });

        // change the old datalevel to the new datalevel that was made
        setDataLevel(dlPayload);
      } catch (error) {
        console.log(error.message);
      }
    },
    [currentDataLevel, selectedRiskAssessment, dataLevel]
  );

  const handleRiskTypeChange = async (riskType) => {
    try {
      const { riskAssessmentId } = selectedRiskAssessment;
      const riskAssessmentHeatMap = (
        await getRiskAssessmentHeatMap(
          { riskAssessmentId },
          riskType === "all" ? null : riskType
        )
      ).data.data;

      const {
        lookUpRowsX: xLabels,
        lookUpRowsY: yLabels,
        values,
      } = riskAssessmentHeatMap;

      let bgCount = 0;
      const heatmapBgTemp = heatmapBackground.map((data, index) => {
        const i = index % xLabels.length; // index % 5

        if (i === 0 && index !== 0) bgCount++;

        return { x: xLabels[bgCount], y: yLabels[i], value: data.value };
      });

      setHeatmapBackground(heatmapBgTemp);

      const heatMap = {
        xLabels,
        yLabels,
        values,
      };

      setSelectedRiskAssessment({ ...selectedRiskAssessment, heatMap });
      setSelectedRiskType(riskType);
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkIfHasPathProperty = (object) => {
    return object.children.find((subObject) =>
      subObject.hasOwnProperty("path")
    );
  };

  const getChildren = useCallback((object) => {
    return checkIfHasPathProperty(object) ? (
      <MenuItem
        text={object.name}
        htmlTitle={object.description ? object.description : null}
        onClick={() =>
          setCurrentDataLevel({ propertyId: object.id, name: object.name })
        }
      />
    ) : object?.children.length > 0 ? (
      <MenuItem MenuItem text={object.name}>
        {object.children.map((subObject) => getChildren(subObject))}
      </MenuItem>
    ) : (
      <MenuItem
        text={object.name}
        htmlTitle={object.description ? object.description : null}
        onClick={() =>
          setCurrentDataLevel({ propertyId: object.id, name: object.name })
        }
      />
    );
  }, []);

  const handleLookUpData = (id, name) => {
    setSelectedLookup({ propertyId: id, name });
    setCurrentDataLevel({ propertyId: id, name });
  };

  const menu = (
    <Menu>
      {lookupData.map((lookup) => (
        <MenuItem
          key={lookup.id}
          text={lookup.name}
          onClick={() => handleLookUpData(lookup.id, lookup.name)}
        />
      ))}
      {metaData.length > 0 && <Divider />}
      {metaData.map((l1) => {
        return (
          <MenuItem key={l1.id} text={l1.name}>
            {l1.metaDataLevel2.map((l2) => {
              return (
                <>
                  {l2.dataObjects[0].children &&
                  !checkIfHasPathProperty(l2.dataObjects[0]) ? (
                    <MenuItem text={l2.name}>
                      {l2.dataObjects[0].children.map((l1Do) =>
                        getChildren(l1Do)
                      )}
                    </MenuItem>
                  ) : (
                    <MenuItem
                      text={l2.name}
                      onClick={() =>
                        setCurrentDataLevel({
                          propertyId: l2.id,
                          name: l2.name,
                        })
                      }
                    />
                  )}
                </>
              );
            })}
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50px",
        }}
      >
        <Tooltip2 content={<span>Main Dashboard</span>}>
          <Button
            icon="undo"
            small
            color="dark"
            onClick={() => setShowDashboardState("default")}
          />
        </Tooltip2>

        <Popover2
          content={
            <>
              <Menu>
                {portfolios.map((portfolio, index) => (
                  <div key={index}>
                    <MenuItem id={portfolio.id} text={portfolio.name}>
                      {portfolio.serviceChains.length === 0
                        ? null
                        : portfolio.serviceChains.map((serviceChain, index) => (
                            <MenuItem key={index} text={serviceChain.name}>
                              {serviceChain.riskAssessments.length === 0
                                ? null
                                : serviceChain.riskAssessments.map(
                                    (riskAssessment, index) => (
                                      <MenuItem
                                        onClick={() =>
                                          setSelectedRiskAssessment({
                                            ...selectedRiskAssessment,
                                            riskAssessmentId: parseInt(
                                              riskAssessment.id
                                            ),
                                            name: riskAssessment.name,
                                          })
                                        }
                                        key={riskAssessment.id}
                                        text={riskAssessment.name}
                                      />
                                    )
                                  )}
                            </MenuItem>
                          ))}
                    </MenuItem>
                  </div>
                ))}
              </Menu>
            </>
          }
          position="bottom"
          interactionKind="hover"
          autoFocus={false}
        >
          <Button
            text={selectedRiskAssessment.name || "select risk assessment"}
            minimal
            large={false}
            className="b f5 white _btn_"
            intent="none"
            icon="share"
          />
        </Popover2>

        <Popover2
          content={
            <>
              <Menu>
                <MenuItem
                  onClick={() => handleRiskTypeChange("all")}
                  text="All"
                />
                <MenuItem
                  onClick={() => handleRiskTypeChange("plat")}
                  text="Plat"
                />
                <MenuItem
                  onClick={() => handleRiskTypeChange("physical")}
                  text="Physical"
                />
                <MenuItem
                  onClick={() => handleRiskTypeChange("virtual")}
                  text="Virtual"
                />
              </Menu>
            </>
          }
          position="bottom"
          interactionKind="hover"
          autoFocus={false}
        >
          <Button
            text={selectedRiskType}
            minimal
            large={false}
            className="b f5 white _btn_"
            intent="none"
            icon="share"
          />
        </Popover2>

        <Popover2
          content={menu}
          position="bottom"
          interactionKind="hover"
          autoFocus={false}
        >
          <Button
            text={`${
              currentDataLevel.name
                ? currentDataLevel.name
                : "select risk object properties"
            }`}
            minimal
            large={false}
            className="b f5 white _btn_"
            intent="none"
            icon="share"
          />
        </Popover2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ width: "550px", height: "400px", margin: "15px" }}>
          <Card
            className={`${styles.windowCard} `}
            style={{ width: "100%", height: "100%" }}
            elevation={Elevation.TWO}
          >
            <div
              name="window-draggable-header"
              className={`handle bp3-dark ${styles.windowHeader}`}
            >
              <div className={styles.windowHeader_title}>
                {/* {changeTypeLoading && <Spinner size={12} intent={Intent.PRIMARY} />} */}
                <div className="bp3-ui-text">HeatMap Chart</div>
              </div>
            </div>
            <div
              className={
                window.type === "risk0"
                  ? styles.windowBodyScroll
                  : styles.windowBody
              }
            >
              <D3HeatMap
                heatmapBackground={
                  selectedRiskAssessment.heatMap.values.length > 0
                    ? heatmapBackground
                    : []
                }
                displayedCellData={selectedRiskAssessment.heatMap.values}
                setSelectedPlatforms={setSelectedPlatforms}
                xLabels={selectedRiskAssessment.heatMap.xLabels}
                yLabels={selectedRiskAssessment.heatMap.yLabels}
                rules={heatmapRules}
                defaultHexColorCode="#000000"
                axis={{ xAxis: "controlAdequacy", yAxis: "fmodeSeverity" }}
              />
            </div>
          </Card>
        </div>

        <div style={{ width: "550px", height: "400px", margin: "15px" }}>
          <Card
            className={`${styles.windowCard} `}
            style={{ width: "100%", height: "100%" }}
            elevation={Elevation.TWO}
          >
            <div
              name="window-draggable-header"
              className={`handle bp3-dark ${styles.windowHeader}`}
            >
              <div className={styles.windowHeader_title}>
                {/* {changeTypeLoading && <Spinner size={12} intent={Intent.PRIMARY} />} */}
                <div className="bp3-ui-text">DrillDown Chart</div>
              </div>
            </div>
            <div
              className={
                window.type === "risk0"
                  ? styles.windowBodyScroll
                  : styles.windowBody
              }
            >
              <D3DrillDown
                drillDownData={selectedRiskAssessment.drillDown}
                handleSelectedElements={handleSelectedElements}
                heatmapRules={heatmapRules}
              />
            </div>
          </Card>
        </div>

        <div style={{ width: "550px", height: "400px", margin: "15px" }}>
          <Card
            className={`${styles.windowCard} `}
            style={{ width: "100%", height: "100%" }}
            elevation={Elevation.TWO}
          >
            <div
              name="window-draggable-header"
              className={`handle bp3-dark ${styles.windowHeader}`}
            >
              <div className={styles.windowHeader_title}>
                {/* {changeTypeLoading && <Spinner size={12} intent={Intent.PRIMARY} />} */}
                <div className="bp3-ui-text">TreeMap Chart</div>
              </div>
            </div>
            <div
              className={
                window.type === "risk0"
                  ? styles.windowBodyScroll
                  : styles.windowBody
              }
            >
              {treeMapState.length > 0 && (
                <D3TreeMap treeMapData={treeMapState} />
              )}
            </div>
          </Card>
        </div>

        <div style={{ width: "550px", height: "400px", margin: "15px" }}>
          <Card
            className={`${styles.windowCard} `}
            style={{ width: "100%", height: "100%" }}
            elevation={Elevation.TWO}
          >
            <div
              name="window-draggable-header"
              className={`handle bp3-dark ${styles.windowHeader}`}
            >
              <div className={styles.windowHeader_title}>
                {/* {changeTypeLoading && <Spinner size={12} intent={Intent.PRIMARY} />} */}
                <div className="bp3-ui-text">Connected Scatter Plot</div>
              </div>
            </div>
            <div
              className={
                window.type === "risk0"
                  ? styles.windowBodyScroll
                  : styles.windowBody
              }
            >
              <D3ConnectedScatter graphData={graphData} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
