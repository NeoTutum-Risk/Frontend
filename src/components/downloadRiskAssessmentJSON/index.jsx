import { useState, useEffect, useCallback } from "react";
import {
  Button,
  H5,
  HTMLSelect,
  Intent,
} from "@blueprintjs/core";
import { Popover2, Classes } from "@blueprintjs/popover2";
import RiskAssessmentMenu from "../riskAssessmentMenu";
import { showDangerToaster } from "../../utils/toaster";
import { getAllPortfolios, getSenarios, fetchtRiskAssessmentJSON } from "../../services";
import { BACKEND_URI } from "../../constants";

const DownloadRiskAssessmentJSON = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [popupState, setPopupState] = useState(false);
  const [scenariosList, setScenariosList] = useState([]);
  const [scenarioSelected, setScenarioSelected] = useState({
    scenarioId: 0,
    scenarioRunId: 0
  });
  const [selectedRiskAssessment, setSelectedRiskAssessment] = useState({
    riskAssessmentId: null,
    name: null,
  });

  /**
   *
   * @param {Object} riskAssessment
   *
   * @description get the data of the selected risk assessment and add it in its state
   */
  const selectRiskAssessmentHandler = async (riskAssessment) => {
    setSelectedRiskAssessment({
      riskAssessmentId: parseInt(riskAssessment.id),
      name: riskAssessment.name,
    });

    const response = await getSenarios(parseInt(riskAssessment.id))

    if (response.status >= 200 && response.status < 300) {
      setScenariosList(response.data.data)
    }
  };


  const downloadRiskAssessmentHandler = async () => {
    try {
      const response = await fetchtRiskAssessmentJSON({
        riskAssessmentId: selectedRiskAssessment.riskAssessmentId,
        ...scenarioSelected
      });

      if (response.status === 200) {
        const result = response.data;

        result.metaData && delete result.metaData;

        // handling the creation of json file
        const fileName = `${selectedRiskAssessment.name}_file`;
        const json = JSON.stringify(result, null, "\t");
        const blob = new Blob([json], { type: "application/json" });
        const href = await URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showDangerToaster(`Error Retrieving Risk Assessment Data`);
      }
    } catch (error) {
    }
  };

  const handlePopupClose = () => {
    setPopupState(false);
    setSelectedRiskAssessment({
      riskAssessmentId: null,
      name: null,
    });
  };

  const portfoliosCallback = useCallback(async () => {
    try {
      const portfoliosRes = await getAllPortfolios();

      const data = portfoliosRes.data.data;
      setPortfolios(data);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    portfoliosCallback();
  }, []);

  return (
    <Popover2
      popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
      isOpen={popupState}
      content={
        <section >
          <div key="text">
            <H5>Select Risk Assessment</H5>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <RiskAssessmentMenu
                  portfolios={portfolios}
                  selectedRiskAssessment={selectedRiskAssessment}
                  selectRiskAssessmentHandler={selectRiskAssessmentHandler}
                />

                <div>
                  <HTMLSelect
                    onClick={(e) => {
                      if (e.target.value !== "Select Scenario Run") {
                        const senarioIds = e.target.value.split('-')
                        if (senarioIds instanceof Array)
                          setScenarioSelected({
                            scenarioId: senarioIds[0],
                            scenarioRunId: senarioIds[1]
                          })
                      }

                    }}
                  >
                    <option selected disabled>
                      Select Scenario Run
                    </option>
                    {scenariosList.length > 0 ? (
                      scenariosList.map((data) => {
                        const scenario = [
                          <option disabled>
                            Senario - {data.name}
                          </option>,
                          ...data.SenarioRuns.map((run) => (
                            <option value={`${data.id}-${run.id}`}>
                              {run.name}
                            </option>
                          )),
                        ];
                        return scenario;
                      })
                    ) : (
                      <option>Loading Scenarios Data...</option>
                    )}
                  </HTMLSelect>
                </div>

                <div style={{ marginTop: ".5rem" }}>
                  <Button
                    className={Classes.POPOVER2_DISMISS}
                    style={{ marginRight: 10 }}
                    onClick={handlePopupClose}
                  >
                    Cancel
                  </Button>
                  {selectedRiskAssessment.riskAssessmentId && (
                    <>
                      <Button
                        type="submit"
                        intent={Intent.SUCCESS}
                        className={Classes.POPOVER2_DISMISS}
                        onClick={downloadRiskAssessmentHandler}
                      >
                        Download
                      </Button>
                      {/* <a href={`${BACKEND_URI}/JSONAnalytics/RA-Analytics-IO/${selectedRiskAssessment.riskAssessmentId}`} target="_blank">
                        <Button
                          icon="link"
                          intent={Intent.SUCCESS}
                          style={{ margin: "0 .5rem" }}
                        >
                          Preview File
                        </Button>
                      </a> */}
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section >
      }
    >
      <div onClick={() => setPopupState(true)}>
        Download Risk Assessment JSON
      </div>
    </Popover2 >
  );
};

export default DownloadRiskAssessmentJSON;
