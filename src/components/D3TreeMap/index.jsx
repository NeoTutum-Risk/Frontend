import { useRef, useEffect, useState } from "react";
import * as d3 from "d3"

const D3TreeMap = ({treeMapDummyData}) => {
    const svgRef = useRef(null);
    const [selectedDummyData, setSelectedDummyData] = useState(treeMapDummyData)
  
    const handleSelectedRect = (treeMapData) => {
      if(treeMapData.data.children) {
        setSelectedDummyData(treeMapData.data.children)
      }
    }
  
    useEffect(() => {
      const MARGINS = { top: 20, right: 20, bottom: 20, left: 20 };
  
      const CHART_WIDTH = 600 - MARGINS.left - MARGINS.right;
      const CHART_HEIGHT = 300 - MARGINS.top - MARGINS.bottom;
  
      const chartContainer = d3
        .select(svgRef.current)
        .attr("width", CHART_WIDTH + MARGINS.left + MARGINS.right)
        .attr("height", CHART_HEIGHT + MARGINS.top + MARGINS.bottom);
  
      chartContainer.selectAll("*").remove();
  
      const chart = chartContainer.append("g");
  
      const root = d3
        .stratify()
        .id((data) => data.name) // Name of the entity (column name is name in csv)
        .parentId((data) => data.parent)(selectedDummyData); // Name of the parent (column name is parent in csv)
  
      root.sum((data) => data.value); // Compute the numeric value for each entity
  
      // Then d3.treemap computes the position of each element of the hierarchy
      // The coordinates are added to the root object above
      d3.treemap().size([CHART_WIDTH, CHART_HEIGHT]).padding(4)(root);
  
      chart
        .selectAll(".bar")
        .data(root.leaves())
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("width", (data) => data.x1 - data.x0)
        .attr("height", (data) => data.y1 - data.y0)
        .attr("x", (data) => data.x0)
        .attr("y", (data) => data.y0)
        .style("stroke", "black")
        .style("fill", "#69b3a2")
        .on("click", (e) => handleSelectedRect(e.target.__data__))
  
        /*
      chart
        .selectAll(".label")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", (data) => data.x0 + 10) // +10 to adjust position (more right)
        .attr("y", (data) => data.y0 + 20) // +20 to adjust position (lower)
        .text((data) => data.data.name)
        .attr("font-size", "10px")
        .attr("cursor", "pointer")
        .attr("fill", "white")
        .on("click", (e) => handleSelectedRect(e.target.__data__))
        */
  
        chart
        .selectAll(".label")
        .data(root.leaves())
        .enter()
        .append("foreignObject")
        .attr("x", (data) => data.x0 + 10) // +10 to adjust position (more right)
        .attr("y", (data) => data.y0 + 5) // +20 to adjust position (lower)
        .attr("width", (data) => data.x1 - data.x0)
        .attr("height", (data) => data.y1 - data.y0)
        .attr("font-size", "10px")
        .attr("cursor", "pointer")
        .attr("fill", "white")
        .on("click", (e) => handleSelectedRect(e.target.__data__))
        .append("xhtml:div")
        .attr("style", "text-align: left;overflow-wrap: break-word;")
        .text((data) => data.data.name)
  
        /*
        chart
        .selectAll(".label")
        .data(root.leaves())
        .enter()
        .append("text")
        .selectAll('tspan')
        .data(d => {
            return d.data.name.split(/(?=[A-Z][^A-Z])/g) // split the name of movie
                .map(v => {
                    return {
                        text: v,
                        x0: d.x0,                        // keep x0 reference
                        y0: d.y0                         // keep y0 reference
                    }
                });
        })
        .enter()
        .append('tspan')
        .attr("x", (d) => d.x0 + 5)
        .attr("y", (d, i) => d.y0 + 15 + (i * 10))       // offset by index 
        .text((d) => d.text)
        .attr("font-size", "10px")
        .attr("cursor", "pointer")
        .attr("fill", "white")
        .on("click", (e) => handleSelectedRect(e.target.__data__))
        */
  
    }, [selectedDummyData]);
  
    return <svg ref={svgRef} />;
}

export default D3TreeMap