import { Menu, MenuDivider, MenuItem, Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React, { useCallback, useEffect, useState } from "react";
import { getAllPortfolios } from "../../services";
import { RiskAssessment } from "./../../components/riskAssessment/index copy";
import { getRiskAssessmentIfExist } from "./../../services/index";
import D3HeatMap from "../../components/D3HeatMap";
import { continentDummyData } from "../../components/D3GraphsContainer/dummyData";

export const heatmapDummyData = [
  {
    controlAdequacy: "1",
    fmodeSeverity: "1",
    value: 1,
  },
  {
    controlAdequacy: "1",
    fmodeSeverity: "2",
    value: 23,
  },
  {
    controlAdequacy: "1",
    fmodeSeverity: "3",
    value: 15,
  },
  {
    controlAdequacy: "1",
    fmodeSeverity: "4",
    value: 21,
  },
  {
    controlAdequacy: "1",
    fmodeSeverity: "5",
    value: 13,
  },
  {
    controlAdequacy: "2",
    fmodeSeverity: "1",
    value: 28,
  },
  {
    controlAdequacy: "2",
    fmodeSeverity: "2",
    value: 5,
  },
  {
    controlAdequacy: "2",
    fmodeSeverity: "3",
    value: 1,
  },
  {
    controlAdequacy: "2",
    fmodeSeverity: "4",
    value: 3,
  },
  {
    controlAdequacy: "2",
    fmodeSeverity: "5",
    value: 6,
  },
  {
    controlAdequacy: "3",
    fmodeSeverity: "1",
    value: 24,
  },
  {
    controlAdequacy: "3",
    fmodeSeverity: "2",
    value: 23,
  },
  {
    controlAdequacy: "3",
    fmodeSeverity: "3",
    value: 53,
  },
  {
    controlAdequacy: "3",
    fmodeSeverity: "4",
    value: 52,
  },
  {
    controlAdequacy: "3",
    fmodeSeverity: "5",
    value: 42,
  },
  {
    controlAdequacy: "4",
    fmodeSeverity: "1",
    value: 2,
  },
  {
    controlAdequacy: "4",
    fmodeSeverity: "2",
    value: 7,
  },
  {
    controlAdequacy: "4",
    fmodeSeverity: "3",
    value: 33,
  },
  {
    controlAdequacy: "4",
    fmodeSeverity: "4",
    value: 34,
  },
  {
    controlAdequacy: "4",
    fmodeSeverity: "5",
    value: 55,
  },
  {
    controlAdequacy: "5",
    fmodeSeverity: "1",
    value: 4,
  },
  {
    controlAdequacy: "5",
    fmodeSeverity: "2",
    value: 23,
  },
  {
    controlAdequacy: "5",
    fmodeSeverity: "3",
    value: 35,
  },
  {
    controlAdequacy: "5",
    fmodeSeverity: "4",
    value: 48,
  },
  {
    controlAdequacy: "5",
    fmodeSeverity: "5",
    value: 66,
  },
];

const riskViewObjects = [{}];

const heatmapRules = [
  { minValue: 1, maxValue: 30, hexColorCode: "#00af50" },
  { minValue: 31, maxValue: 60, hexColorCode: "#ffff01" },
  { minValue: 61, maxValue: 90, hexColorCode: "#ed7d31" },
  { minValue: 91, maxValue: 120, hexColorCode: "#f50101" },
  { minValue: 121, maxValue: 150, hexColorCode: "#7030a0" },
];

const fmodeSeverityValues = {
  NonCompliance: "1",
  Minor: "2",
  Material: "3",
  Major: "4",
  Severe: "5"
}

// Labels of row and columns of heat map
const heatmapXLabels = Array.from({ length: 5 }, (_, i) => (i + 1).toString());
const heatmapYLabels = Array.from({ length: 5 }, (_, i) => (i + 1).toString());

console.log(heatmapXLabels);

const SelectRiskAssessment = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); // this is dummy currently for the component to not argue with us
  const [selectedPortfolio, setSelectedPortfolio] = useState({
    portfolioId: null,
    name: null,
    serviceChains: [],
  });
  const [selectedServiceChain, setSelectedServiceChain] = useState({
    serviceChainId: null,
    name: null,
    riskAssessments: [],
  });
  const [selectedRiskAssessment, setSelectedRiskAssessment] = useState({
    riskAssessmentId: null,
    name: null,
    controlAdequacy: null,
    fmodeSeverity: null,
  });

  console.log(portfolios);

  const initialLoading = useCallback(async () => {
    const res = await getAllPortfolios();

    const data = res.data.data;

    console.log(data);

    setPortfolios(data);
  }, []);

  useEffect(() => {
    initialLoading();
  }, [initialLoading]);

  const handleSelectedPortfolio = (e) => {
    if (selectedPortfolio.portfolioId) {
      setSelectedServiceChain({
        serviceChainId: null,
        name: null,
        riskAssessments: [],
      });
      setSelectedRiskAssessment({
        riskAssessmentId: null,
        name: null,
        controlAdequacy: null,
        fmodeSeverity: null,
      });
    }

    const portfolioId = parseInt(e.currentTarget.id);

    const selectedPort = portfolios.find(
      (portfolio) => portfolio.id === portfolioId
    );

    setSelectedPortfolio({
      portfolioId,
      name: selectedPort.name,
      serviceChains: selectedPort.serviceChains,
    });
  };

  const handleSelectedServiceChain = (e) => {
    if (selectedServiceChain.serviceChainId) {
      setSelectedRiskAssessment({
        riskAssessmentId: null,
        name: null,
        controlAdequacy: null,
        fmodeSeverity: null,
      });
    }

    const serviceChainId = parseInt(e.currentTarget.id);

    const selectedServChain = selectedPortfolio.serviceChains.find(
      (serviceChain) => serviceChain.id === serviceChainId
    );

    setSelectedServiceChain({
      serviceChainId,
      name: selectedServChain.name,
      riskAssessments: selectedServChain.riskAssessments,
    });
  };

  const handleSelectedRiskAssessment = async (selectedRiskAssess) => {
    const riskAssessmentId = parseInt(selectedRiskAssess.id);

    /*
    const selectedRiskAssess = selectedServiceChain.riskAssessments.find(
      (riskAssessment) => riskAssessment.id === riskAssessmentId
    );
    */

    const riskAssessment = (await getRiskAssessmentIfExist(riskAssessmentId))
      .data.data;

    setSelectedRiskAssessment({
      riskAssessmentId,
      name: selectedRiskAssess.name,
      controlAdequacy: riskAssessment.controlAdequacy,
      fmodeSeverity: fmodeSeverityValues[riskAssessment.fmodeSeverity],
    });
  };

  return (
    <div>
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
                                        handleSelectedRiskAssessment(
                                          riskAssessment
                                        )
                                      }
                                      key={index}
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
          text="select platform"
          minimal
          large={false}
          className="b f5 white _btn_"
          intent="none"
          icon="share"
        />
      </Popover2>

      <D3HeatMap
        heatmapDummyData={heatmapDummyData}
        displayedCellData={[selectedRiskAssessment]}
        setSelectedPlatforms={setSelectedPlatforms}
        xLabels={heatmapXLabels}
        yLabels={heatmapYLabels}
        rules={heatmapRules}
        defaultHexColorCode="#000000"
        axis={{ xAxis: "controlAdequacy", yAxis: "fmodeSeverity" }}
      />
    </div>
  );
};

export default SelectRiskAssessment;
