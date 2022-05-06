import { ClosedEitor } from "./closedEditor";
export const ClosedFace = ({ data, groupId, setFace, setEditor }) => {
  return (
    <>
      <div className="risk-object-closed-header" onClick={() => setFace((prev) => !prev)}>
        <div style={{backgroundColor:"lightblue"}}>
        <span
            
          >{`${data.type[0].toUpperCase()}: ${data.id}`}</span>
        </div>
        <div style={{backgroundColor:"lightblue"}}>
        <span >
            {groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
          </span>
        </div>
        <div style={{backgroundColor:"lightblue"}}>
        <span >
            {data.name}
          </span>
        </div>
      </div>
      <div className="risk-object-closed-body" style={{backgroundColor:"lightsteelblue"}} onClick={() => setEditor((prev) => !prev)}>
      <span style={{ overflow: "auto"}}>
            {data.description}
          </span>
          
      </div>
    </>
  );
};
