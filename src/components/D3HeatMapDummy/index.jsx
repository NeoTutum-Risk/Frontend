import { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3HeatMapDummy = ({continentDummyData, setSelectedPlatforms, heatmapDummyData, xLabels, yLabels, rules, defaultHexColorCode}) => {
    const svgRef = useRef(null);

    const handleShownContenents = (heatmapData) => {
      const resultArrLength = continentDummyData.filter(
        (continent) => continent.value === `${heatmapData.variable}-${heatmapData.group}`
      ).length;
  
      return resultArrLength === 0 ? null : resultArrLength;
    };
  
    const handleSelectedPlatform = (selectedHeatmapData) => {
      const platforms = continentDummyData.filter(
        //(continent) => continent.value === selectedHeatmapData.value
        (continent) => continent.value === `${selectedHeatmapData.variable}-${selectedHeatmapData.group}`
      );
      if (platforms.length !== 0) {
        setSelectedPlatforms(platforms)
      }
    };
  
    const handleColor = (value) => {
      const rule = rules.find(rule => value >= rule.minValue && value <= rule.maxValue)

      if(!rule) return defaultHexColorCode


      return rule.hexColorCode
    }
  
    useEffect(() => {
      const MARGINS = { top: 20, right: 20, bottom: 20, left: 20 };
  
      const CHART_WIDTH = 600 - MARGINS.left - MARGINS.right;
      const CHART_HEIGHT = 300 - MARGINS.top - MARGINS.bottom;
  
      const x = d3.scaleBand().range([MARGINS.left, CHART_WIDTH]);
      const y = d3.scaleBand().range([CHART_HEIGHT, 0]);
  
      const chartContainer = d3
        .select(svgRef.current)
        .attr("width", CHART_WIDTH + MARGINS.left + MARGINS.right)
        .attr("height", CHART_HEIGHT + MARGINS.top + MARGINS.bottom);
  
      chartContainer.selectAll("*").remove();
  
      x.domain(xLabels);
      y.domain(yLabels);
  
      //var myColor = d3.scaleLinear().range(["white", "#69b3a2"]).domain([1, 100]);
  
      const chart = chartContainer.append("g");
  
      chart
        .append("g")
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .attr("transform", `translate(0,${CHART_HEIGHT})`)
        .call(d3.axisBottom(x));
  
      chart
        .append("g")
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .attr("transform", `translate(${MARGINS.left},0)`);
  
      chart
        .selectAll(".bar")
        .data(heatmapDummyData)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("x", (data) => x(data.group))
        .attr("y", (data) => y(data.variable))
        .style("fill", (data) => handleColor(data.value))
        .on("click", (event) => handleSelectedPlatform(event.target.__data__));
  
      chart
        .selectAll(".label")
        .data(heatmapDummyData)
        .enter()
        .append("text")
        .text((data) => handleShownContenents(data))
        .attr("x", (data) => x(data.group) + x.bandwidth() / 2)
        .attr("y", (data) => y(data.variable) + y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("cursor", "pointer")
        .classed("label", true)
        .on("click", (event) => handleSelectedPlatform(event.target.__data__));
    }, []);
  
    return <svg ref={svgRef} />;
}

export default D3HeatMapDummy