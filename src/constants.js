export const BACKEND_URI = 'https://uat-service-dot-neotutum.nw.r.appspot.com/';
export const SOCKET_URI = 'https://socket-service-dot-neotutum.nw.r.appspot.com'

export const TEST_BACKEND_URI = 'https://test-service-dot-neotutum.nw.r.appspot.com/'

export const JL =`http://35.246.24.150:8888/tree`;

export const windowDefault = {width:500,height:400};

export const EMPTY_BPMN = `<?xml version="1.0" encoding="UTF-8"?><bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:bpsim="http://www.bpsim.org/schemas/1.0" xmlns:drools="http://www.jboss.org/drools" id="__619EOlREDmPU_nTdG4K-Q" targetNamespace="http://www.omg.org/bpmn20" exporter="jBPM Process Modeler" exporterVersion="2.0" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd http://www.jboss.org/drools drools.xsd http://www.bpsim.org/schemas/1.0 bpsim.xsd http://www.omg.org/spec/DD/20100524/DC DC.xsd http://www.omg.org/spec/DD/20100524/DI DI.xsd "><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_SkippableInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_PriorityInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_CommentInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_DescriptionInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_CreatedByInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_TaskNameInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_GroupIdInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_ContentInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_NotStartedReassignInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_NotCompletedReassignInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_NotStartedNotifyInputXItem" structureRef="Object"/><bpmn2:itemDefinition id="__F6C24295-2471-4525-9C6C-454A7EFAE53E_NotCompletedNotifyInputXItem" structureRef="Object"/><bpmn2:interface id="_80E7130A-1EE7-46BA-A1D1-E327919D9B82_ServiceInterface" name="" implementationRef=""><bpmn2:operation id="_80E7130A-1EE7-46BA-A1D1-E327919D9B82_ServiceOperation" name="" implementationRef=""/></bpmn2:interface><bpmn2:process id="new_file" name="new_file" processType="Public" isExecutable="true" drools:packageName="com.example" drools:version="1.0" drools:adHoc="false"/><bpmndi:BPMNDiagram><bpmndi:BPMNPlane bpmnElement="new_file"/></bpmndi:BPMNDiagram><bpmn2:relationship type="BPSimData"><bpmn2:extensionElements><bpsim:BPSimData><bpsim:Scenario id="default" name="Simulationscenario"><bpsim:ScenarioParameters/><bpsim:ElementParameters elementRef="_F463E629-F5D5-443A-8CB2-6E80E26B1365"><bpsim:TimeParameters><bpsim:ProcessingTime><bpsim:NormalDistribution mean="0" standardDeviation="0"/></bpsim:ProcessingTime></bpsim:TimeParameters></bpsim:ElementParameters><bpsim:ElementParameters elementRef="_F6C24295-2471-4525-9C6C-454A7EFAE53E"><bpsim:TimeParameters><bpsim:ProcessingTime><bpsim:NormalDistribution mean="0" standardDeviation="0"/></bpsim:ProcessingTime></bpsim:TimeParameters><bpsim:ResourceParameters><bpsim:Availability><bpsim:FloatingParameter value="0"/></bpsim:Availability><bpsim:Quantity><bpsim:FloatingParameter value="0"/></bpsim:Quantity></bpsim:ResourceParameters><bpsim:CostParameters><bpsim:UnitCost><bpsim:FloatingParameter value="0"/></bpsim:UnitCost></bpsim:CostParameters></bpsim:ElementParameters><bpsim:ElementParameters elementRef="_80E7130A-1EE7-46BA-A1D1-E327919D9B82"><bpsim:TimeParameters><bpsim:ProcessingTime><bpsim:NormalDistribution mean="0" standardDeviation="0"/></bpsim:ProcessingTime></bpsim:TimeParameters><bpsim:ResourceParameters><bpsim:Availability><bpsim:FloatingParameter value="0"/></bpsim:Availability><bpsim:Quantity><bpsim:FloatingParameter value="0"/></bpsim:Quantity></bpsim:ResourceParameters><bpsim:CostParameters><bpsim:UnitCost><bpsim:FloatingParameter value="0"/></bpsim:UnitCost></bpsim:CostParameters></bpsim:ElementParameters><bpsim:ElementParameters elementRef="_930FFCB2-5E47-4A07-BA22-1538571B0143"><bpsim:TimeParameters><bpsim:ProcessingTime><bpsim:NormalDistribution mean="0" standardDeviation="0"/></bpsim:ProcessingTime></bpsim:TimeParameters><bpsim:ResourceParameters><bpsim:Availability><bpsim:FloatingParameter value="0"/></bpsim:Availability><bpsim:Quantity><bpsim:FloatingParameter value="0"/></bpsim:Quantity></bpsim:ResourceParameters><bpsim:CostParameters><bpsim:UnitCost><bpsim:FloatingParameter value="0"/></bpsim:UnitCost></bpsim:CostParameters></bpsim:ElementParameters></bpsim:Scenario></bpsim:BPSimData></bpmn2:extensionElements><bpmn2:source>__619EOlREDmPU_nTdG4K-Q</bpmn2:source><bpmn2:target>__619EOlREDmPU_nTdG4K-Q</bpmn2:target></bpmn2:relationship></bpmn2:definitions>`;