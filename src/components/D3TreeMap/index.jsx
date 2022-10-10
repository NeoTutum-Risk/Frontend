import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const D3TreeMap = ({ treeMapData }) => {
  const svgRef = useRef(null);
  const [selectedData, setSelectedData] = useState(treeMapData[0]);
  const [currentDescription, setCurrentDescription] = useState(null)

  (selectedData)

  const mouseover = (e, d) => {
    setCurrentDescription(d.data.description)
  }

  const mouseout = () => {
    setCurrentDescription(null)
  }

  const handleSelectedRect = (treeMapData) => {

    if (!treeMapData.data.hasOwnProperty("children1")) return;
    if(treeMapData.data.children1.length === 0) return;

    const children = treeMapData.data.children1;

    delete treeMapData.data.children1;

    setSelectedData({ ...treeMapData.data, children });

    /*
      if(treeMapData.data.children) {
        setSelectedData(treeMapData.data.children)
      }
      */
  };

  useEffect(() => {
    let tempTreeMapData = { ...selectedData };

    tempTreeMapData.children = tempTreeMapData.children.map(
      ({ children, ...data }) => ({
        ...data,
        children1: children,
        childrenCount: children.length,
      })
    );

    (tempTreeMapData)

    const MARGINS = { top: 20, right: 20, bottom: 20, left: 20 };

    const CHART_WIDTH = 600 - MARGINS.left - MARGINS.right;
    const CHART_HEIGHT = 300 - MARGINS.top - MARGINS.bottom;

    const chartContainer = d3
      .select(svgRef.current)
      .attr("width", CHART_WIDTH + MARGINS.left + MARGINS.right)
      .attr("height", CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

    chartContainer.selectAll("*").remove();

    const chart = chartContainer.append("g");

    const root = d3.hierarchy(tempTreeMapData).sum((data) => {
      return data.count;
    });

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
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)



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
  }, [selectedData]);

  return (
    <div>
      <svg ref={svgRef} />

      <div>
        description section: {currentDescription}
      </div>
    </div>
  );
};

export default D3TreeMap;
