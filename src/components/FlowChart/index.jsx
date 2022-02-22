import { Button, ButtonGroup } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { memo, useCallback, useEffect, useState, useRef } from 'react';
import React from 'react';
import {Network} from 'vis-network';
import {DataSet} from 'vis-data';
import { showDangerToaster } from "../../utils/toaster";

export const FlowChart = ({ graph, onNetworkChange }) => {

  var nodes = new DataSet(graph.nodes);
<<<<<<< HEAD
  var edges = new DataSet(graph.edges);
=======
  var edges = [];//new DataSet(graph.edges);
>>>>>>> 4ddf52e7a4a4c916cfe4ee8d8e996abdd486b0d7
  var canAddEdge = false;
  var chosenNode1 = null;
  var network;


  const createEdge = useCallback((from, to)=>{

    if(from.level_value !== to.level_value - 1){
      canAddEdge = false;
      chosenNode1 = null;
      showDangerToaster('Invalid connection made');
      return;
    }

    edges.push({from:from.id, to:to.id});
    network.setData({nodes,edges});
    canAddEdge = false;
    chosenNode1 = null;
    onNetworkChange({sourceId:from.id, targetId:to.id, name:""});
  },[canAddEdge,chosenNode1,edges,network,onNetworkChange])

  const canAddEdgeHandler = ()=>{
    canAddEdge = true;
  }

  const nodeClicked = useCallback((id,edgeAllowed)=>{

    if(!canAddEdge) return;

    if(chosenNode1){
      createEdge(chosenNode1,id);
    }else{
      chosenNode1 = id;
    }
  },[canAddEdge,chosenNode1])


  const visJsRef = useRef(null);

   useEffect(() => {

    nodes.forEach((node, nodeIndex) => {
      node.x = 90 * nodeIndex;
      node.y = 70 * node.level_value || 0;
    });


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
        var clickedNode = nodes.get(ids[0]);
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