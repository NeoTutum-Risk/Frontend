export const ConnetionContext = ({ data, setSelectedElements }) => {
  console.log("cc", data);
  return (
    <>
    <g style={{ cursor: "pointer" }}  onClick={()=>data.function(data.option)}>
      <rect
        height={20}
        width={data.option === "Connect" ? 70 : 140}
        rx={2}
        x={data.x}
        y={data.y}
        fill="#A2B5CD"
        stroke="#104E8B"
      />
      <text
        stroke="#000000"
        opacity={0.9}
        strokeWidth="1px"
        dy=".3em"
        x={Number(data.x) + 10}
        y={Number(data.y) + 10}
       
      >
        {data.option}
      </text>
    </g>
    <g style={{ cursor: "pointer" }}  onClick={()=>setSelectedElements([])}>
      <rect
        height={20}
        width={data.option === "Connect" ? 70 : 140}
        rx={2}
        x={data.x}
        y={data.y+20}
        fill="#A2B5CD"
        stroke="#104E8B"
      />
      <text
        stroke="#000000"
        opacity={0.9}
        strokeWidth="1px"
        dy=".3em"
        x={Number(data.x) + 10}
        y={Number(data.y) + 30}
       
      >
        Deselect
      </text>
    </g>
    </>
    
  );
};
