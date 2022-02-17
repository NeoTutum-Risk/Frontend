export const CollapsePanel = ({children}) => {
  const panelStyle = {
    position: "fixed",
    bottom: 10,
    right:0,
    // backgroundColor: "red",
    height:"35px",
    width:"75vw",
    display:"flex",
    flexDirection:"row-reverse",
    zIndex:100,
    paddingRight:"5px",
    
  };
  return <div style={panelStyle}>{children}</div>;
};
