import { Popover2 } from "@blueprintjs/popover2";
import { Button, Menu, MenuItem } from "@blueprintjs/core";

const RiskAssessmentMenu = ({
  portfolios,
  selectedRiskAssessment,
  selectRiskAssessmentHandler,
}) => {
  return (
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
                                      selectRiskAssessmentHandler(
                                        riskAssessment
                                      )
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
  );
};

export default RiskAssessmentMenu;
