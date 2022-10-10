import { useEffect, useState } from "react";
export const Tooltip = ({ x, y, data }) => {
  // const [levels, setLevels] = useState(0);
  // const [description,setDescription]=useState("");
  // // const [descriptionArray,setDescriptionArray] = useState([]);

  // useEffect(()=>{
  //   setDescription("Desciption: "+data.description);
  //   setLevels(Math.ceil(description.length/41));
  // },[])
  const description = "Desciption: "+data.description;
  const levels =Math.ceil(description.length/41);
  let descriptionArray =[];
  let levelText;
  for(let i =0; i<levels;i++){
    if((description[(i+1)*40]!==" " && description[(i+1)*40]!==",") && i!==levels-1){
      levelText=description.slice(i*40,(i+1)*40)+"-";
    }else{
      levelText=description.slice(i*40,(i+1)*40);
    }
    descriptionArray.push(levelText);
  }
  return (
    <g >
      <rect
        height={60+(15*levels)}
        width={300}
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
      {descriptionArray.map((level,index)=><text
        stroke="#000000"
        // opacity={0.5}
        strokeWidth="1px"
        dy=".3em"
        x={Number(x) + 15}
        y={Number(y) + 45+(15*(index+1))}
      >{level}</text>)}
 
    </g>
  );
};
