import D3GraphsContainer from "../../components/D3GraphsContainer";
import { SideNavigator } from "../dashboard/sideNavigator";
import classes from "./D3Graphs.module.css"

const D3Graphs = () => {
  return (
    <div className={classes.container}>
      <SideNavigator />
      <D3GraphsContainer />
    </div>
  );
};

export default D3Graphs;
