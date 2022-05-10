export const OpenFace = ({ data, groupId, setFace }) => {
  return (
    <>
      <div className="risk-object-inner-row">
        <div
          className="risk-object-inner-column"
          onClick={() => setFace((prev) => !prev)}
          title={data.description}
        >
          <span
            style={{ position: "relative", top: "35%" }}
          >{`${data.type[0].toUpperCase()}: ${data.id}`}</span>
        </div>
        <div
          className="risk-object-inner-column"
          style={{ border: "dashed 1px blue" }}
        >
          <span style={{ position: "relative", top: "35%" }}>+</span>
        </div>
        <div className="risk-object-inner-column">
          <span style={{ position: "relative", top: "35%" }}>Chart</span>
        </div>
      </div>
      <div className="risk-object-inner-row">
        <div className="risk-object-inner-column">
          <span style={{ position: "relative", top: "35%" }}>
            {groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
          </span>
        </div>

        <div
          className="risk-object-inner-column"
          style={{ border: "dashed 1px blue" }}
        >
          <span style={{ position: "relative", top: "35%" }}>+</span>
        </div>

        <div className="risk-object-inner-column">
          <span style={{ position: "relative", top: "35%" }}>Con</span>
        </div>
      </div>
    </>
  );
};
