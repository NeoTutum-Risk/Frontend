import { Button, ButtonGroup, InputGroup } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { memo, useCallback, useEffect, useState, useRef } from 'react';
import React from 'react';
import {Network} from 'vis-network';
import {DataSet} from 'vis-data';
import { showDangerToaster, showSuccessToaster } from "../../utils/toaster";

export const FlowChart = ({ graph, onNetworkChange }) => {


  var nodes = null;
  var edges = [];
  var canAddEdge = false;
  var chosenNode1 = null;
  var network;
  var newEdgeName = '';


  const createEdge = (from, to)=>{

    if(from.level_value !== to.level_value - 1){
      canAddEdge = false;
      chosenNode1 = false;
      showDangerToaster('Invalid connection made');
      return;
    }

    edges.push({from:from.id, to:to.id});
    network.setData({nodes,edges});
    canAddEdge = false;
    chosenNode1 = null;
    onNetworkChange({sourceId:from.id, targetId:to.id, name:newEdgeName});
    newEdgeName = '';
  }

  const canAddEdgeHandler = ()=>{
    canAddEdge = true;
    console.log(canAddEdge);
  }

  const nodeClicked = (id)=>{

    console.log("canAddEdge: "+canAddEdge);

    if(!canAddEdge) return;

    if(chosenNode1){
      createEdge(chosenNode1,id);
    }else{
      chosenNode1 = id;
    }
  }

  const networkOnClickHandler = (properties)=>{
      var ids = properties.nodes;
      var clickedNode = nodes.get(ids[0]);
      nodeClicked(clickedNode);
      onNetworkChange(properties);
  }


  const visJsRef = useRef(null);

   useEffect(() => {

    nodes = new DataSet(graph.nodes);

    nodes.forEach((node, nodeIndex) => {
      node.x = 90 * nodeIndex;
      node.y = 70 * node.level_value || 0;
    });

    edges = graph.edges;

    var data = {nodes,edges};

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
        smooth:false,
        arrows: {
                to: {
                  enabled: true
                }
            }
        }
    };

    network = visJsRef.current && new Network(visJsRef.current, data,options);

    network.on('click', networkOnClickHandler);

  },[visJsRef,graph,edges])


  return (
    <div style={{width: '100%', height: '100%', display:"flex",flexDirection:"column"}}>
      <div style={{position:"absolute",zIndex:20,padding:"10px",paddingTop:"5px",paddingBottom:"5px"}}>
        <div style={{display:"inline-block",verticalAlign:"middle"}}>
        <InputGroup
          required
          placeholder="New Connection Name..."
          onChange={event => {
            newEdgeName = event.target.value;
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
      <div ref={visJsRef} style={{width: '100%', height:"90%", position: 'relative', cursor: 'pointer' }} />
    </div>
  )

}