import { Menu, MenuDivider, MenuItem, Classes } from "@blueprintjs/core";
import React, { useCallback, useEffect, useState } from "react";
import { getAllPortfolios } from "../../services";

const SelectRiskAssessment = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState({portfolioId: null, serviceChains: []})
  

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

    const portfolioId = parseInt(e.currentTarget.id)

    const selectedPort = portfolios.find(portfolio => portfolio.id === portfolioId)

    setSelectedPortfolio({portfolioId, serviceChains: selectedPort.serviceChains})
  }

  const handleSelectedServiceChain = (e) => {

  }

  return (
    <div>
      <Menu className={Classes.ELEVATION_1}  >
        {portfolios.map((porftolio, index) => (
          <div key={index}>
            <MenuItem onClick={handleSelectedPortfolio} id={porftolio.id} text={porftolio.name} />
            <MenuDivider />
          </div>
        ))}
      </Menu>

{
  selectedPortfolio.portfolioId &&

      <Menu>
      { selectedPortfolio.serviceChains.map((serviceChain, index) => (
          <div key={index}>
            <MenuItem onClick={handleSelectedServiceChain} id={serviceChain.id} text={serviceChain.name} />
            <MenuDivider />
          </div>
        ))}
      </Menu>
      }
    </div>
  );
};

export default SelectRiskAssessment;
