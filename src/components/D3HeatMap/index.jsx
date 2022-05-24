import { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3HeatMap = ({displayedCellData, setSelectedPlatforms, heatmapBackground, xLabels, yLabels, rules, defaultHexColorCode, axis}) => {
    const svgRef = useRef(null);

    console.log("displayed cell data: ", displayedCellData)
    console.log("heat map background data: ", heatmapBackground)
    console.log("labels", {xLabels, yLabels})

    const handleShownContenents = (heatmapData) => {
      const resultArrLength = displayedCellData.filter(
        (cellData) => 
          cellData.x === heatmapData.x && cellData.y === heatmapData.y
      ).length;
  
      return resultArrLength === 0 ? null : resultArrLength;
    };
  
    const handleSelectedDisplayCell = (selectedHeatmapData) => {
      const result = displayedCellData.filter(
        //(continent) => continent.value === selectedHeatmapData.value
        (cellData) => cellData.x === selectedHeatmapData.x && cellData.y === selectedHeatmapData.x
      );
      if (result.length !== 0) {
        setSelectedPlatforms(result)
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
        .data(heatmapBackground)
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("x", (data) => x(data.x))
        .attr("y", (data) => y(data.y))
        .style("fill", (data) => handleColor(data.value))
        .on("click", (event) => handleSelectedDisplayCell(event.target.__data__));

      chart
        .selectAll(".label")
        .data(heatmapBackground)
        .enter()
        .append("text")
        .text((data) => handleShownContenents(data))
        .attr("x", (data) => x(data.x) + x.bandwidth() / 2)
        .attr("y", (data) => y(data.y) + y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("cursor", "pointer")
        .classed("label", true)
        .on("click", (event) => handleSelectedDisplayCell(event.target.__data__));
    }, [displayedCellData]);
  
    return <svg ref={svgRef} />;
}

export default D3HeatMap