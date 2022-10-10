import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Slider, Button } from "@blueprintjs/core";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRecoilState } from "recoil";
import { elementSelectorState } from "../../store/elementSelector";

export const Table = ({
  width = 600,
  height = 400,
  data = [],
  columns = [],
  paginationPageSize = 10,
  operations = {},
  tableFullWidth = false,
}) => {
  ("table", data, columns);
  const gridRef = useRef();
  const [elementSelector, setElementSelector] =
    useRecoilState(elementSelectorState);
  (elementSelector);
  const autoSizeAll = useCallback((skipHeader) => {
    const allColumnIds = [];
    gridRef.current.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    tableFullWidth
      ? gridRef.current.api.sizeColumnsToFit()
      : gridRef.current.columnApi.autoSizeColumns(allColumnIds, false);
  }, [tableFullWidth]);

  useEffect(() => {
    if (elementSelector && elementSelector !== "process") {
      gridRef.current.api.deselectAll();
      const selectedElementIndex = data.findIndex(
        (row) =>
          row.elementId === elementSelector.elementId &&
          row.fileId === elementSelector.fileId
      );
      //.indexOf(elementSelector);
      if (selectedElementIndex && selectedElementIndex > -1) {
        if(gridRef.current.api.getRowNode(selectedElementIndex)){
          gridRef.current.api.getRowNode(selectedElementIndex).setSelected(true);
        }
        
      }
    } else {
      gridRef.current.api.deselectAll();
    }
  }, [elementSelector, data]);

  const EditOperator = (field) => {
    return (
      <button
        onClick={() =>
          operations.hasOwnProperty("edit")
            ? operations.edit.func(field.field.data.id)
            : {}
        }
      >
        Edit
      </button>
    );
  };

  const ViewOperator = (field) => {
    return (
      <button
        onClick={() =>
          operations.hasOwnProperty("view")
            ? operations.view.func(field.field.data.id)
            : {}
        }
      >
        View
      </button>
    );
  };

  const DeleteOperator = (field) => {
    return (
      <button
        onClick={() =>
          operations.hasOwnProperty("delete")
            ? operations.delete.func(field.field.data.id)
            : {}
        }
      >
        Delete
      </button>
    );
  };

  return (
    <div className="ag-theme-balham" style={{ height, width }}>
      <AgGridReact
        ref={gridRef}
        pagination
        // paginationPageSize={paginationPageSize}
        paginationAutoPageSize={true}
        rowData={data}
        onFirstDataRendered={autoSizeAll}
      >
        {columns.map((column) => (
          <AgGridColumn
            key={column.field}
            field={column.field}
            sortable={column.sortable ?? true}
            filter={column.filter ?? true}
            resizable={column.resizable ?? true}
            suppressSizeToFit={column.suppressSizeToFit ?? true}
            width={column.width}
          />
        ))}
        {operations.hasOwnProperty("view") && (
          <AgGridColumn
            key="viewOperator"
            field="viewOperator"
            resizable={true}
            width={operations.view.width}
            cellRendererFramework={(field) => <ViewOperator field={field} />}
          />
        )}

        {operations.hasOwnProperty("edit") && (
          <AgGridColumn
            key="editOperator"
            field="editOperator"
            resizable={true}
            width={operations.edit.width}
            cellRendererFramework={(field) => <EditOperator field={field} />}
          />
        )}

        {operations.hasOwnProperty("delete") && (
          <AgGridColumn
            key="deleteOperator"
            field="deleteOperator"
            resizable={true}
            width={operations.delete.width}
            cellRendererFramework={(field) => <DeleteOperator field={field} />}
          />
        )}
      </AgGridReact>
    </div>
  );
};
