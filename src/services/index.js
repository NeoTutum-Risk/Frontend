import { xmlParser } from "../utils/xmlParser";
import { serviceProvider, testServiceProvider } from "./serviceProvider";

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

export const addMetaDataLevel2 = (data) => serviceProvider.post(`/metaDataLevel1/metaDataLevel2`, data);

export const updateMetaDataLevel2 = (id, data) => serviceProvider.put(`/metaDataLevel1/metaDataLevel2/${id}`, data)

export const updateDataObject = (id, data) =>
  serviceProvider.put(`/dataObjects/status/${id}`, data);

export const getDataObjectElement = (id) =>
  serviceProvider(`dataObjects/elements/${id}`);

export const updateDataObjectElement = (id, data) =>
  serviceProvider.put(`dataObjects/${id}`, data);

export const emptyDatabase = () => serviceProvider.delete("/deleteAll");

export const getRiskAssessment = (id,data) => serviceProvider.post(`/riskAssessments/${id}`,data);
export const getRiskAssessmentGroup = (riskAssessmenId,id) => serviceProvider(`/riskAssessments/${riskAssessmenId}/${id}`);

export const addRiskObjectProperties = (id, data) => serviceProvider.put(`/riskObjectProperties/${id}`, data);

export const addModelRiskObjectProperties = (id, data) => serviceProvider.put(`/riskObjectProperties/modelProperties/${id}`, data);

export const getRiskAssessmentTable = (id) => serviceProvider(`/riskAssessments/table/${id}`);

export const updateReferenceGroupStatus = (id, data) => serviceProvider.put(`/referenceGroups/${id}`, data);

export const UploadLookupFile = (data) => serviceProvider.post('/lookup', data);

export const getAllLookup = () => serviceProvider('/lookup');
export const getRiskAssessmentPhysicalTable = (id) => serviceProvider(`/riskAssessments/physical/${id}`);

export const updateRiskObjectPosition = (riskAssessmenId, id, data) => serviceProvider.put(`/riskObjects/positions/${riskAssessmenId}/${id}`, data);

export const addRiskConnection = (data) => serviceProvider.post(`/riskConnections`, data);

export const deleteRiskConnection = (id,data) => serviceProvider.delete(`/riskConnections/${id}`,data);

export const editRiskConnection = (id, data) => serviceProvider.put(`/riskConnections/${id}`, data);

export const deleteInstanceRiskConnection = (id) => serviceProvider.delete(`/dataObjectNewRiskObjectConnections/${id}`);

export const deleteInstanceConnection = (id) => serviceProvider.delete(`/dataObjectNewConnections/${id}`);

export const addRiskAssessmentGroup = (data) => serviceProvider.post(`/riskObjectGroups`, data);

export const updateRiskAssessmentGroup = (groupId, riskAssessmenId, data) => serviceProvider.put(`/riskObjectGroups/${riskAssessmenId}/${groupId}`, data);

export const deleteRiskAssessmentGroup = (id) => serviceProvider.delete(`/riskObjectGroups/${id}`);

export const addRiskTemplate = (data) => serviceProvider.post(`/riskTemplates`, data);

export const addGroupFromTemplate = (data) => serviceProvider.post(`/riskTemplates/createRiskObjectGroup`, data);

export const getTemplates = () => serviceProvider(`/riskTemplates`);

export const getRiskObjectProperties = (data) => serviceProvider.post(`/riskObjects/properties`, data);

export const updateRiskObject = (id, data) => serviceProvider.put(`/riskObjects/edit/${id}`, data);

export const getRiskObject = (id) => serviceProvider(`/riskObjects/${id}`);

export const getAllPortfolios = () => serviceProvider('/portfolios');

export const getGroups = () => serviceProvider(`/riskObjectGroups`);

export const importGroup = (data) => serviceProvider.post(`/riskGroupPositions`, data);

export const getRiskAssessmentHeatMap = ({ riskAssessmentId, lookupPropertyId = 169 }, riskType = null) => serviceProvider(`/platData/${riskAssessmentId}/${lookupPropertyId}${riskType ? `?riskType=${riskType}` : ''}`)

export const getRiskAssessmentDrillDown = (data) => serviceProvider.post('/platData/drillDownCharts', data)

export const getAllTreeMap = () => serviceProvider('/platData/drillDownTreeMap');

export const getNewDataObjects = () => serviceProvider(`dataObjectNew`);

export const addNewDataObjects = (data) => serviceProvider.post(`dataObjectNew`, data);

export const addNewDataObjectInstance = (data) => serviceProvider.post(`dataObjectNewProperties`, data);

export const updateNewDataObjectInstance = (id, data) => serviceProvider.put(`dataObjectNewProperties/${id}`, data);

export const updateNewDataObjectInstanceNew = (riskAssessmenId, id, data) => serviceProvider.put(`dataObjectNewProperties/positions/${riskAssessmenId}/${id}`, data);

export const addInstanceConnection = (data) => serviceProvider.post(`dataObjectNewConnections`, data);

export const addInstanceObjectConnection = (data) => serviceProvider.post(`dataObjectNewRiskObjectConnections`, data);

export const editGroup = (riskAssessmentId, riskGroupId, data) => serviceProvider.put(`riskObjectGroups/editGroup/${riskAssessmentId}/${riskGroupId}`, data);

export const deleteProperty = (id) => serviceProvider.delete(`/riskObjects/properties/${id}`);

export const updateProperty = (id, data) => serviceProvider.put(`riskObjects/properties/${id}`, data);

export const findJSONData = (data) => serviceProvider.post("JSONAnalytics/JsonIO", data);

export const checkDeletedPhysicalDataObj = (bpmnId) => serviceProvider(`bpmnFile/riskObjectsDeleted/${bpmnId}`)


export const getRiskAssessmentViews = (id) => serviceProvider(`filterViews/riskAssessment/${id}`);

export const addRiskAssessmentView = (data) => serviceProvider.post(`filterViews`, data);

export const updateRiskAssessmentView = (id, data) => serviceProvider.put(`filterViews/${id}`, data);

export const fetchtRiskAssessmentJSON = (id, data) => serviceProvider.post(`JSONAnalytics/RA-Analytics-IO/${id}`, data)

export const updateRiskAssessmentWindowSettings = (id, data) => serviceProvider.put(`riskAssessments/${id}`, data)

export const getRiskAssessmentWindowSettings = (id) => serviceProvider(`/riskAssessments/WindowSettings/${id}`)



export const updateReferenceWindowSettings = (id, data) => serviceProvider.put(`dataObjects/WindowSettings/${id}`, data)

export const getReferenceWindowSettings = (id) => serviceProvider(`/dataObjects/WindowSettings/${id}`)



export const addObjectToGroup = (data) => serviceProvider.post(`riskObjectGroups/addObject/Group`, data);

export const unshareGroup = (data) => serviceProvider.post(`riskGroupPositions/unShareGroup`, data);

export const addElementGroup = (data) => serviceProvider.post(`referenceDataObjectGroups`, data);

export const updateElementGroup = (data) => serviceProvider.put(`referenceDataObjectGroups`, data);

export const addElementToGroup = (data) => serviceProvider.put(`referenceDataObjectGroups/addObject/Group`, data);

export const removeElementFromGroup = (data) => serviceProvider.put(`referenceDataObjectGroups/removeObject/Group`, data);

export const CloneDataObject = (data) => serviceProvider.post(`dataObjects/cloneDataObject`, data);

export const getBayesianCharts = (data) => serviceProvider.post(`analytics_charts/bulkCharts/bayesian/${data.riskAssessmentId}`);

export const getGenericCharts = (data) => serviceProvider.post(`analytics_charts/bulkCharts/generic/${data.riskAssessmentId}`);

export const getAnalysispackCharts = (data) => serviceProvider.post(`analytics_charts/bulkCharts/analysispack/${data.riskAssessmentId}`, data);

export const addAnalysisPack = (data) => serviceProvider.post(`analytics_charts/analysis/pack`, data);

export const getAnalysisPacks = () => serviceProvider.get(`analytics_charts/analysis/pack`);

export const getAnalysisPacksRuns = () => serviceProvider.get(`analytics_charts/analysis/pack/runs`);

export const getNoteBook = (id) => serviceProvider.get(`notebooks/${id}`);


export const addScenario = (data) => serviceProvider.post(`senarios`, data);

export const addScenarioRun = (data) => serviceProvider.post(`/senarios/runs`, data);

export const addVisualObject = (data) => serviceProvider.post(`/textObjects`, data);

export const editVisualObject = (id,data) => serviceProvider.put(`/textObjects/${id}`, data);

export const deleteVisualObject = (id) =>serviceProvider.delete(`/textObjects/${id}`);

export const editAnalyticsChart = (id,data) => serviceProvider.put(`/analytics_charts/${id}`, data);

export const deleteAnalyticsChart = (id) =>serviceProvider.delete(`/analytics_charts/${id}`);

export const getAnalyticsChartsCausal = (data) => serviceProvider.post(`analytics_charts/bulkCharts/analysispack/causal/${data.riskAssessmentId}`, data);

export const getRiskAssessmentLogs = (id) =>serviceProvider.get(`/analytics_runs/logs/${id}`)

export const editActiveSenario = (data) => serviceProvider.put(`/senarios/runs`, data)
