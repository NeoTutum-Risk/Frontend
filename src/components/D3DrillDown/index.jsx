import { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3DrillDown = ({drillDownDummyData, handleSelectedElements}) => {
    const svgRef = useRef(null);

  useEffect(() => {
    const MARGINS = { top: 20, bottom: 20 };

    const CHART_WIDTH = 600;
    const CHART_HEIGHT = 300 - MARGINS.top - MARGINS.bottom;

    const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

    const chartContainer = d3
      .select(svgRef.current)
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

    chartContainer.selectAll("*").remove();

    x.domain(drillDownDummyData.map((data) => data.region));
    y.domain([0, d3.max(drillDownDummyData, (data) => data.value) + 15]);

    const chart = chartContainer.append("g");

    chart
      .append("g")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr("transform", `translate(0, ${CHART_HEIGHT + 1})`)
      .attr("color", "#4f009e");

    chart
      .selectAll(".bar")
      .data(drillDownDummyData)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", x.bandwidth())
      .attr("height", (data) => CHART_HEIGHT - y(data.value))
      .attr("x", (data) => x(data.region))
      .attr("y", (data) => y(data.value))
      .on("click", (event) => handleSelectedElements(event.target.__data__));

    chart
      .selectAll(".label")
      .data(drillDownDummyData)
      .enter()
      .append("text")
      .text((data) => data.value)
      .attr("x", (data) => x(data.region) + x.bandwidth() / 2)
      .attr("y", (data) => y(data.value) - 20)
      .attr("text-anchor", "middle")
      .classed("label", true);
  }, [drillDownDummyData]);

  return (
    <svg
      style={{ border: "1px solid black" }}
      ref={svgRef}
    />
  );
}

export default D3DrillDown