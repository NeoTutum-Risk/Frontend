import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";

const D3DrillDown = ({drillDownData, handleSelectedElements, heatmapRules}) => {
    const svgRef = useRef(null);

    ("drill down data: ", drillDownData)

    const handleBarColor = useCallback((barIndex) => {
      const rule = heatmapRules[barIndex]

      if(rule) return rule.hexColorCode

      return "black"
    }, [heatmapRules])

  useEffect(() => {
    const MARGINS = { top: 20, bottom: 20 };

    const drillDownKeys = Object.keys(drillDownData)

    const CHART_WIDTH = 530;
    const CHART_HEIGHT = 300 - MARGINS.top - MARGINS.bottom;

    const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

    const chartContainer = d3
      .select(svgRef.current)
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

    chartContainer.selectAll("*").remove();

    x.domain(drillDownKeys.map(key => key));
    y.domain([0, d3.max(Object.values(drillDownData), (data) => data) + 15]);

    const chart = chartContainer.append("g");

    chart
      .append("g")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr("transform", `translate(0, ${CHART_HEIGHT + 1})`)
      .attr("color", "#4f009e");

    chart
      .selectAll(".bar")
      .data(drillDownKeys)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", x.bandwidth())
      .attr("height", (data) => CHART_HEIGHT - y(drillDownData[data]))
      .attr("x", (data) => x(data))
      .attr("y", (data) => y(drillDownData[data]))
      .attr("fill", (data, index) => handleBarColor(index))
      .on("click", (event) => handleSelectedElements(event.target.__data__));

    chart
      .selectAll(".label")
      .data(drillDownKeys)
      .enter()
      .append("text")
      .text((data) => drillDownData[data])
      .attr("x", (data) => x(data) + x.bandwidth() / 2)
      .attr("y", (data) => y(drillDownData[data]) - 20)
      .attr("text-anchor", "middle")
      .classed("label", true);
  }, [drillDownData, handleSelectedElements, handleBarColor]);

  return (
    <svg
      style={{ border: "1px solid black" }}
      ref={svgRef}
    />
  );
}

export default D3DrillDown