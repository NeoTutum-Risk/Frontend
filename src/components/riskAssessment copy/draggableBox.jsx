import { useState } from "react";
import Draggable from "react-draggable";
import Xarrow, { useXarrow, xarrowPropsType, Xwrapper } from "react-xarrows";

export const DraggableBox = ({ data , position,handleContextMenu }) => {
  const updateXarrow = useXarrow();
  const [pos,setPos] = useState({x:position.x,y:position.y-50});
  return (
    <Draggable onDrag={updateXarrow} onStop={(e)=>(e)}>
      <div
      onContextMenu={handleContextMenu}
        id={data.id}
        style={{
          border: "1px #999 solid",
          borderRadius: "10px",
          textAlign: "center",
          width: "100px",
          height: "30px",
          color: "black",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          position:"relative",
          // top:pos.y,
          // left:pos.x
        }}
      >
        {data.name}
      </div>
    </Draggable>
  );
};
