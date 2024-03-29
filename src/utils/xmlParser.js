import XMLParser from 'react-xml-parser'

export const arrayFilter = (jsonArray, filter) => {
  const filtered = jsonArray.filter(jsonItem => {
    return jsonItem.name.toLowerCase().includes(filter)
  })
  return filtered
}

export const xmlParser = content => {
  const BPMNJson = new XMLParser().parseFromString(content)
  const processArray = arrayFilter(BPMNJson.children, 'process');
  const diagramArray = arrayFilter(BPMNJson.children,'diagram');
  let fullObject = {
    bpmnAssociations: [],
    bpmnEntities: [],
    bpmnSequenceFlows: [],
    bpmnLanes: [],
  }
  
  processArray.forEach(process => {
    fullObject.bpmnSequenceFlows.push(arrayFilter(process.children, 'sequenceflow'))
    fullObject.bpmnAssociations.push(arrayFilter(process.children, 'association'))
    fullObject.bpmnEntities.push(arrayFilter(process.children, 'task'))
    fullObject.bpmnEntities.push(arrayFilter(process.children, 'event'))
    fullObject.bpmnEntities.push(arrayFilter(process.children, 'dataobject'))
    fullObject.bpmnEntities.push(arrayFilter(process.children, 'textannotation'))
  })

  diagramArray.forEach(diagram =>{
    fullObject.bpmnLanes.push(arrayFilter(diagram.children, 'lane'))
  })

  for (const [key, value] of Object.entries(fullObject)) {
    fullObject[key] = value.length > 0 ? value.flat() : []
  }

  return fullObject
}
