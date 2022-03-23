import { xmlParser } from "../utils/xmlParser";
import { serviceProvider } from "./serviceProvider";

export const getPortfolios = () => serviceProvider("/portfolios");

export const getReferenceGroups = () => serviceProvider("/referenceGroups");

export const getMetaData = () => serviceProvider("metaDataLevel1");

export const getMetaDataL2 = () => serviceProvider("metaDataLevel2");

export const addDataObject = (data) =>
  serviceProvider.post("/dataObjects", data);

export const getDataObject = (id) => serviceProvider(`/dataObjects/${id}`);

export const addNewReferenceGroup = (data) =>
  serviceProvider.post("/referenceGroups", data);

export const addServiceChain = (data) =>
  serviceProvider.post("/serviceChains", data);

export const addNewPortfolio = (data) =>
  serviceProvider.post("/portfolios", data);

export const addNewPlatform = (data) =>
  serviceProvider.post("/platforms", data);

export const addNewRiskAssessment = (data) =>
  serviceProvider.post("/riskAssessments", data);

export const addNewRiskObject = (data) =>
  serviceProvider.post("/riskObjects", data);

export const addNewElementsConnection = (data) =>
  serviceProvider.post("/dataObjectConnections", data);

export const removeNewElementsConnection = ({ id }) =>
  serviceProvider.delete(`/dataObjectConnections/${id}`);

export const getDataObjectConnections = () =>
  serviceProvider("dataObjectConnections");

export const addNewBpmn = ({
  file,
  platformId,
  creatorId,
  fileName,
  bpmnAssociations = [],
  bpmnSequenceFlows = [],
  bpmnEntities = [],
  bpmnLanes = [],
}) => {
  return serviceProvider("/bpmnFile", {
    method: "post",
    data: {
      fileName,
      platformId,
      fileData: file,
      creatorId,
      bpmnAssociations: bpmnAssociations,
      bpmnSequenceFlows: bpmnSequenceFlows,
      bpmnEntities: bpmnEntities,
      bpmnLanes: bpmnLanes,
    },
  });
};

export const getBpmnEntities = (data) => serviceProvider.get("bpmnEntities");
export const getBpmnAssociations = (data) =>
  serviceProvider.get("bpmnAssociations");
export const getBpmnSequenceFlows = (data) =>
  serviceProvider.get("bpmnSequenceFlows");
export const getBpmnLanes = (data) => serviceProvider.get("bpmnLanes");

export const archiveBpmn = ({ id }) =>
  serviceProvider.delete(`/bpmnFile/${id}`);

export const updateBpmnStatus = ({ id, status, fileData }) =>
  serviceProvider.put(`/bpmnFile/${id}`, {
    status: status,
    ...(status === "changed" && { fileData, ...xmlParser(fileData) }),
  });

export const getSpecificMetaData = (id) =>
  serviceProvider(`metaDataLevel1/${id}`);

export const deleteMetaData = (id) =>
  serviceProvider.delete(`/metaDataLevel1/${id}`);

export const addMetaData = (data) =>
  serviceProvider.post(`/metaDataLevel1`, data);

export const updateMetaData = (id, data) =>
  serviceProvider.put(`/metaDataLevel1/${id}`, data);

export const updateDataObject = (id, data) =>
  serviceProvider.put(`/dataObjects/status/${id}`, data);

export const getDataObjectElement = (id) =>
  serviceProvider(`dataObjects/elements/${id}`);

export const updateDataObjectElement = (id, data) =>
  serviceProvider.put(`dataObjects/${id}`, data);

export const emptyDatabase = () => serviceProvider.delete("/deleteAll");

export const getRiskAssessment = (id) => serviceProvider(`/riskAssessments/${id}`);

export const addRiskObjectProperties = (id,data) => serviceProvider.put(`/riskObjectProperties/${id}`,data);

export const getRiskAssessmentTable = (id) => serviceProvider(`/riskAssessments/table/${id}`);