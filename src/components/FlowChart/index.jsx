import { Button, ButtonGroup, InputGroup } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { memo, useCallback, useMemo, useEffect, useState, useRef } from 'react';
import React from 'react';
import {Network} from 'vis-network';
import {DataSet} from 'vis-data';
import { showDangerToaster, showSuccessToaster } from "../../utils/toaster";
import Graph from "react-graph-vis";
import { useResizeDetector } from "react-resize-detector";

export const FlowChart = ({ graph, onNetworkChange }) => {


  const [canAddEdge, setCanAddEdge] = useState(false);
  const [chosenNode1, setChosenNode1] = useState(null);
  const [newEdgeName,setNewEdgeName] = useState('');
  const [network, setNetwork] = useState(null);
  const visJsRef = useRef(null);
  const calculateNodesAndEdges = useCallback((inputGraph)=>{
    return {nodes:inputGraph.nodes.map((node,nodeIndex)=> {
      return {
        label:node.label,
        id:node.id,
        x:(node.x || (node.level_value * 200)),
        y:(node.y || (nodeIndex * 80 - (node.level_value * 80))),
        level_value:node.level_value
      }
    }), edges:inputGraph.edges
    };
  },[]);
  const [mainGraph,setMainGraph] = useState(graph);
  const memoGraph = useMemo(() => calculateNodesAndEdges(mainGraph), [mainGraph]);

  const nodeOnDragHandler = useCallback(async(event)=>{
    if(!event.nodes[0]) return;
    const mainGraphTmp = mainGraph;
    for(let index = 0;index < mainGraphTmp.nodes.length;index++){
      if(mainGraphTmp.nodes[index].id === event.nodes[0]){
        console.log("triggered");
        mainGraphTmp.nodes[index].x = event.event.center.x;
        mainGraphTmp.nodes[index].y = event.event.center.y;
      }
    }
    await setMainGraph(mainGraphTmp);
    console.log(mainGraphTmp);

  },[mainGraph])

  const createEdge = useCallback(async(from, to)=>{

    if(from.id === to.id) return;

    if(from.level_value !== to.level_value - 1){
      setCanAddEdge(false);
      setChosenNode1(null);
      showDangerToaster('Invalid connection made');
      return;
    }

    const newGraph = mainGraph;
    newGraph.edges.push({from:from.id, to:to.id,label:newEdgeName});
    await setMainGraph(newGraph);
    await network.setData(calculateNodesAndEdges(mainGraph));
    console.log(mainGraph);
    setCanAddEdge(false);
    setChosenNode1(null);
    onNetworkChange({sourceId:from.id, targetId:to.id, name:newEdgeName});
    setNewEdgeName('');
  },[setMainGraph,mainGraph,setChosenNode1,newEdgeName,setNewEdgeName,onNetworkChange,network])

  const canAddEdgeHandler = useCallback(()=>{
    setCanAddEdge(true);
  },[canAddEdge,setCanAddEdge])

  const nodeClicked = (id)=>{

    if(!canAddEdge) return;

    if(chosenNode1){
      createEdge(chosenNode1,id);
      console.log('2');
    }else{
      setChosenNode1(id);
      console.log('1');
      console.log(id);
    }
  }

  const networkOnClickHandler = useCallback((properties)=>{
      var ids = properties.nodes;
      var clickedNode = mainGraph.nodes.filter((node)=> node.id === properties.nodes[0])[0];
      console.log(clickedNode);
      nodeClicked(clickedNode);
      //onNetworkChange(properties);
  }, [mainGraph, canAddEdge,nodeClicked,network]);

  const options = {
    height: '100%',
    width: '100%',
    locale: 'en',
    interaction: {
      multiselect: true
    },
    physics: {
      enabled: false
    },
    nodes: {
      shape: "dot",
      size: 20,
      font: {
        size: 16,
        color: "#383838",
      },
      borderWidth: 2,
    },
    edges: {
      smooth:false,
      width: 2,
      arrows: {
              to: {
                enabled: true
              }
          }
      }
  }

  const events = {
    doubleClick: (eventObject)=>{},
    click: networkOnClickHandler,
    dragEnd: nodeOnDragHandler
  }


  return (
    <div style={{width: '100%', height: '100%', display:"flex",flexDirection:"column"}}>
      <div style={{position:"absolute",zIndex:20,padding:"10px",paddingTop:"5px",paddingBottom:"5px"}}>
        <div style={{display:"inline-block",verticalAlign:"middle"}}>
        <InputGroup
          required
          placeholder="New Connection Name..."
          onChange={event => {
            setNewEdgeName(event.target.value);
          }}
        />
        </div>
        <div style={{
          display:"inline-block",
          verticalAlign:"middle",
          marginLeft:"20px"
          }}
        >
          <Button intent="none" text="Add Connection" onClick={canAddEdgeHandler} />
        </div>
      </div>
      <Graph
        graph={memoGraph}
        options={options}
        events={events}
        ref={visJsRef}
        style={{width: '100%', height:"90%", position: 'relative', cursor: 'pointer',overflowY:"hidden" }}
        getNetwork={network => {
          setNetwork(network);
        }}
      />
    </div>
  )

}
