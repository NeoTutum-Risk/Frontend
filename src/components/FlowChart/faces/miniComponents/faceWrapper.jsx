export const FaceWrapper = ({
  handleClick,
  selectedElements,
  data,
  children,
  colors,
  viewIndex,
  rootCall,
}) => {
  return (
    <div
      onClick={handleClick}
      className="panningDisabled pinchDisabled wheelDisabled"
      style={{
        height: "100%",
        border:
          viewIndex !== 0
            ? selectedElements.find((element) => element.id === data.id)
              ? `5px solid ${colors.selected}`
              : !data.disable
              ? `5px solid ${colors.default}`
              : `5px solid ${colors.disabled}`
            : null,
        borderRadius: viewIndex !== 0 ? "15px" : null,
        backgroundColor: "white",
        padding: viewIndex !== 0 ? "5px" : null,
        overflow: "hidden",
      }}
      onContextMenu={(e) => rootCall("context", { e,type: "contextMenu" })}
      onMouseEnter={() => rootCall("objectIn", { id: data.id })}
      onMouseLeave={() => rootCall("objectOut")}
    >
      {children}
    </div>
  );
};
