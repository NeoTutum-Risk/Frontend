import { Menu, MenuDivider, MenuItem, Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import React, { useCallback, useEffect, useState } from "react";
import { getAllPortfolios } from "../../services";
import { RiskAssessment } from './../../components/riskAssessment/index copy';
import { getRiskAssessmentIfExist } from './../../services/index';

const SelectRiskAssessment = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState({portfolioId: null,name: null, serviceChains: []})
  const [selectedServiceChain, setSelectedServiceChain] = useState({serviceChainId: null,name: null, riskAssessments: []})
  const [selectedRiskAssessment, setSelectedRiskAssessment] = useState({riskAssessmentId: null, name: null})

  const initialLoading = useCallback(async () => {
    const res = await getAllPortfolios();

    const data = res.data.data;

    console.log(data)

    setPortfolios(data)
  }, []);

  useEffect(() => {
    initialLoading();
  }, [initialLoading]);

  const handleSelectedPortfolio = (e) => {
    if(selectedPortfolio.portfolioId) {
      setSelectedServiceChain({serviceChainId: null,name: null, riskAssessments: []})
      setSelectedRiskAssessment({riskAssessmentId: null,name: null})
    }

    const portfolioId = parseInt(e.currentTarget.id)

    const selectedPort = portfolios.find(portfolio => portfolio.id === portfolioId)

    setSelectedPortfolio({portfolioId,name: selectedPort.name, serviceChains: selectedPort.serviceChains})
  }

  const handleSelectedServiceChain = (e) => {
    if(selectedServiceChain.serviceChainId) {
      setSelectedRiskAssessment({riskAssessmentId: null,name: null})
    }

    const serviceChainId = parseInt(e.currentTarget.id)

    const selectedServChain = selectedPortfolio.serviceChains.find(serviceChain => serviceChain.id === serviceChainId)

    setSelectedServiceChain({serviceChainId,name: selectedServChain.name, riskAssessments: selectedServChain.riskAssessments})
  }

  const handleSelectedRiskAssessment = async (e) => {

    const riskAssessmentId = parseInt(e.currentTarget.id)

    const selectedRiskAssess = selectedServiceChain.riskAssessments.find(riskAssessment => riskAssessment.id === riskAssessmentId)

    const riskAssessment = await getRiskAssessmentIfExist(riskAssessmentId)

    console.log(riskAssessment.data.data)

    setSelectedRiskAssessment({riskAssessmentId, name: selectedRiskAssess.name})
  }

  return (
    <div>

<Popover2
     content={
       <>
      <Menu>
        {portfolios.map((porftolio, index) => (
          <div key={index}>
            <MenuItem onClick={handleSelectedPortfolio} id={porftolio.id} text={porftolio.name} />
            <MenuDivider />
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

{selectedPortfolio.portfolioId && <h1 style={{color: "grey"}}>selected Portfolios: <span style={{color: "black"}}>{selectedPortfolio.name}</span></h1> }

{
  selectedPortfolio.portfolioId &&
  <Popover2
     content={
       <>
      <Menu>
      { selectedPortfolio.serviceChains.map((serviceChain, index) => (
          <div key={index}>
            <MenuItem onClick={handleSelectedServiceChain} id={serviceChain.id} text={serviceChain.name} />
            <MenuDivider />
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
     style={{marginTop: "2rem"}}
         text="select service chain"
         minimal
         large={false}
         className="b f5 white _btn_"
         intent="none"
         icon="share"
     />
</Popover2>
}

{selectedServiceChain.serviceChainId && <h1 style={{color: "grey"}}>selected service chain: <span style={{color: "black"}}>{selectedServiceChain.name}</span></h1> }

      {
  selectedServiceChain.serviceChainId &&
  <Popover2
     content={
       <>
      <Menu>
      { selectedServiceChain.riskAssessments.map((riskAssessment, index) => (
          <div key={index}>
            <MenuItem onClick={handleSelectedRiskAssessment} id={riskAssessment.id} text={riskAssessment.name} />
            <MenuDivider />
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
         text="select risk assessment"
         minimal
         large={false}
         className="b f5 white _btn_"
         intent="none"
         icon="share"
     />
</Popover2>

      }

      {selectedRiskAssessment.riskAssessmentId && <h1 style={{color: "grey"}}>selected risk assessment name & id: <span style={{color: "black"}}>{selectedRiskAssessment.name} / {selectedRiskAssessment.riskAssessmentId}</span></h1> }    

    </div>
  );
};

export default SelectRiskAssessment;
