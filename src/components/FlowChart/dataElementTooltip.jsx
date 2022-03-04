import { useEffect, useState } from "react";
export const Tooltip = ({ x, y, data }) => {
  return (
    <g >
      <rect
        height={60}
        width={250}
        rx={10}
        x={x}
        y={y}
        fill="#d3d3d3"
        style={{zIndex:9999999999}}
      />
      <text
        stroke="#000000"
        // opacity={0.5}
        strokeWidth="1px"
        dy=".3em"
        x={Number(x) + 15}
        y={Number(y) + 15}
      >
        Level Id: {data.level_id}
      </text>
      <text
        stroke="#000000"
        // opacity={0.5}
        strokeWidth="1px"
        dy=".3em"
        x={Number(x) + 15}
        y={Number(y) + 30}
      >
        Name : {data.name}
      </text>
      <text
        stroke="#000000"
        // opacity={0.5}
        strokeWidth="1px"
        dy=".3em"
        x={Number(x) + 15}
        y={Number(y) + 45}
      >
        Desciption: {data.description}
      </text>
    </g>
  );
};
