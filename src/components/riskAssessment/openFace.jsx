export const OpenFace = ({ data, groupId, setFace }) => {
  return (
    <>
      <div className="risk-object-inner-row panningDisabled">
        <div
          className="risk-object-inner-column panningDisabled"
          onClick={() => setFace((prev) => !prev)}
          title={data.description}
        >
          <span
            style={{ position: "relative", top: "35%" }}
          >{`${data.type[0].toUpperCase()}: ${data.id}`}</span>
        </div>
        <div
          className="risk-object-inner-column panningDisabled"
          style={{ border: "dashed 1px blue" }}
        >
          <span style={{ position: "relative", top: "35%" }}>+</span>
        </div>
        <div className="risk-object-inner-column panningDisabled">
          <span style={{ position: "relative", top: "35%" }}>Chart</span>
        </div>
      </div>
      <div className="risk-object-inner-row panningDisabled">
        <div className="risk-object-inner-column panningDisabled">
          <span style={{ position: "relative", top: "35%" }}>
            {groupId ? `G: ${Number(groupId - 2000000)}` : `G: `}
          </span>
        </div>

        <div
          className="risk-object-inner-column panningDisabled"
          style={{ border: "dashed 1px blue" }}
        >
          <span style={{ position: "relative", top: "35%" }}>+</span>
        </div>

        <div className="risk-object-inner-column panningDisabled">
          <span style={{ position: "relative", top: "35%" }}>Con</span>
        </div>
      </div>
    </>
  );
};
