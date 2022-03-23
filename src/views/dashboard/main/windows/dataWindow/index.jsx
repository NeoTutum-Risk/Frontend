import { Table } from "../../../../../components/table";
import { Window } from "../window";

export const DataWindow = ({
  window,
  onClose,
  onCollapse,
  onResotre,
  collapseState,
  onTypeChange,
}) => {
  return (
    <Window
      window={window}
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onResotre}
      onTypeChange={onTypeChange}
      title={
        window.data.type === "Level Data"
          ? window.data.levelName
          : window.data.type === "riskTable"? window.data.name + " Data": window.data.type
      }
      collapseState={collapseState}
      icon="th"
    >
      <>
        {window.data.type === "BPMN Associations" && (
          <Table
            width={"100%"}
            height={"100%"}
            data={window.data.associations}
            columns={
              window.data.associations?.[0]
                ? Object.keys(window.data.associations?.[0]).map((key) => ({
                    field: key,
                  }))
                : []
            }
          />
        )}
        {window.data.type === "BPMN Entities" && (
          <Table
            width={"100%"}
            height={"100%"}
            data={window.data.entities}
            columns={
              window.data.entities?.[0]
                ? Object.keys(window.data.entities?.[0]).map((key) => ({
                    field: key,
                  }))
                : []
            }
          />
        )}
        {window.data.type === "BPMN SequenceFlows" && (
          <Table
            width={"100%"}
            height={"100%"}
            data={window.data.sequenceFlows}
            columns={
              window.data.sequenceFlows?.[0]
                ? Object.keys(window.data.sequenceFlows?.[0]).map((key) => ({
                    field: key,
                  }))
                : []
            }
          />
        )}
        {window.data.type === "Lanes" && (
          <Table
            width={"100%"}
            height={"100%"}
            data={window.data.lanes}
            columns={
              window.data.lanes?.[0]
                ? Object.keys(window.data.lanes?.[0]).map((key) => ({
                    field: key,
                  }))
                : []
            }
          />
        )}
        {window.data.type === "Level Data" && (
          <Table
            width={"100%"}
            height={"100%"}
            data={window.data.levelData}
            columns={
              window.data.levelData?.[0]
                ? Object.keys(window.data.levelData?.[0]).map((key) => ({
                    field: key,
                  }))
                : []
            }
          />
        )}
        {window.data.type === "riskTable" && (
          <Table
            width={"100%"}
            height={"100%"}
            data={window.data.riskTable}
            columns={
              window.data.riskTable?.[0]
                ? Object.keys(window.data.riskTable?.[0]).map((key) => ({
                    field: key,
                  }))
                : []
            }
          />
        )}
      </>
    </Window>
  );
};
