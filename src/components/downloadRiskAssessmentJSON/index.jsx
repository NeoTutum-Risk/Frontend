import { useState, useEffect, useCallback } from "react";
import {
  Button,
  H5,
  Intent,
} from "@blueprintjs/core";
import { Popover2, Classes } from "@blueprintjs/popover2";
import RiskAssessmentMenu from "../riskAssessmentMenu";
import { showDangerToaster } from "../../utils/toaster";
import { getAllPortfolios, getRiskAssessment, testGetRiskAssessment } from "../../services";

const DownloadRiskAssessmentJSON = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [popupState, setPopupState] = useState(false);
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
  const selectRiskAssessmentHandler = (riskAssessment) => {
    setSelectedRiskAssessment({
      riskAssessmentId: parseInt(riskAssessment.id),
      name: riskAssessment.name,
    });
  };

  const downloadRiskAssessmentHandler = async () => {
    try {
      const response = await testGetRiskAssessment(
        selectedRiskAssessment.riskAssessmentId
      );
      if (response.status === 200) {
        const result = response.data;
        console.log(result)

        result.metaData && delete result.metaData;

        // handling the creation of json file
        const fileName = `${selectedRiskAssessment.name}_file`;
        const json = JSON.stringify(result);
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
      console.log(error.message);
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

              <div style={{ marginTop: ".5rem" }}>
                <Button
                  className={Classes.POPOVER2_DISMISS}
                  style={{ marginRight: 10 }}
                  onClick={handlePopupClose}
                >
                  Cancel
                </Button>
                {selectedRiskAssessment.riskAssessmentId && (
                  <Button
                    type="submit"
                    intent={Intent.SUCCESS}
                    className={Classes.POPOVER2_DISMISS}
                    onClick={downloadRiskAssessmentHandler}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div onClick={() => setPopupState(true)}>
        Download Risk Assessment JSON
      </div>
    </Popover2>
  );
};

export default DownloadRiskAssessmentJSON;
