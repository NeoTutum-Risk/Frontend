import { Button, ButtonGroup } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { memo, useCallback, useEffect, useState, useRef } from 'react';
import React from 'react';
import {Network} from 'vis-network';

export const FlowChart = ({ graph, onNetworkChange }) => {

  var nodes = graph.nodes;
  var edges = graph.edges;
  var canAddEdge = false;
  var chosenNode1 = null;
  var network;


  const createEdge = (from, to)=>{
    console.log({from,to});
    edges.push({from,to});
    network.setData({nodes,edges});
    canAddEdge = false;
    onNetworkChange({nodes,edges});
  }

  const canAddEdgeHandler = ()=>{
    canAddEdge = true;
  }

  const nodeClicked = (id,edgeAllowed)=>{
    console.log(id);

    if(!canAddEdge) return;
    console.log("Past issue");
    console.log(chosenNode1);

    if(chosenNode1){
      createEdge(chosenNode1,id);
    }else{
      chosenNode1 = id;
    }
  }

  const getCurrentData = ()=>{ return {nodes,edges}; }


  const visJsRef = useRef(null);

   useEffect(() => {

    var data = {nodes,edges};
    console.log(data);
    var options = {
      height: '100%',
      width: '100%',
      locale: 'en',
      interaction: {
        multiselect: true
      },
      physics: {
        enabled: false
      },
      edges: {
        arrows: {
                to: {
                  enabled: true
                }
            }
        }
    };

    network = visJsRef.current && new Network(visJsRef.current, data,options);

    network.on('click', (properties)=>{
        var ids = properties.nodes;
        var clickedNode = ids[0];
        nodeClicked(clickedNode, canAddEdge);
        onNetworkChange(properties);
    });

  },[visJsRef])


  return (
    <div style={{width: '100%', height: '100%', display:"flex",flexDirection:"column"}}>
      <div style={{position:"absolute",zIndex:20,padding:"10px",paddingTop:"5px",paddingBottom:"5px"}}>
        <Button intent="none" text="Add Connection" onClick={canAddEdgeHandler} />
      </div>
      <div ref={visJsRef} style={{width: '100%', height:"90%", position: 'relative', cursor: 'pointer' }} />
    </div>
  )

}
