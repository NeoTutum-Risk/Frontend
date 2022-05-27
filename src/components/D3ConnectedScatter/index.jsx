import { useEffect, useRef } from "react";

import * as d3 from "d3";

const D3ConnectedScatter = ({graphData}) => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
      const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 560 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
  
      // append the svg object to the body of the page
  
      const svgContainer = d3
        .select(chartContainerRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
  
      svgContainer.selectAll("*").remove();
  
      const chart = svgContainer
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      const displayData = graphData.map((data) => {
        const labelArray = data.label.split("-");
        const labelValue =
          (parseFloat(labelArray[0]) + parseFloat(labelArray[1])) / 2;
        return { ...data, label: labelValue };
      });
  
      // Add X axis --> it is a date format
      const x = d3
        .scaleLinear()
        .domain(d3.extent(displayData, (d) => d.label))
        .range([0, width]);
      chart
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
  
      // Add Y axis
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(displayData, (d) => d.value)])
        .range([height, 0]);
      chart.append("g").call(d3.axisLeft(y));
  
      // Add the line
      chart
        .append("path")
        .datum(displayData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(d.label))
            .y((d) => y(d.value))
        );
  
      // create a tooltip
      const Tooltip = d3
      .select(chartContainerRef.current)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");
  
      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = (event, d) => {
        Tooltip.style("opacity", 1);
      };
      const mousemove = (event, d) => {
        Tooltip.html("Exact value: " + d.value)
          .style("left", `${event.layerX + 10}px`)
          .style("top", `${event.layerY}px`);
      };
      const mouseleave = (event, d) => {
        Tooltip.style("opacity", 0);
      };
  
      // Add the points
      chart
        .append("g")
        .selectAll("dot")
        .data(displayData)
        .join("circle")
        .attr("class", "myCircle")
        .style("z-index", 10)
        .attr("cx", (d) => x(d.label))
        .attr("cy", (d) => y(d.value))
        .attr("r", 3)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }, []);
  
    return (
      <div style={{position: "relative"}} ref={chartContainerRef}>
      </div>
    );
}

export default D3ConnectedScatter