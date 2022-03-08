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
}) => {
  console.log("table", data, columns);
  const gridRef = useRef();
  const [elementSelector, setElementSelector] =
    useRecoilState(elementSelectorState);
  console.log(elementSelector);
  const autoSizeAll = useCallback((skipHeader) => {
    const allColumnIds = [];
    gridRef.current.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getId());
    });
    gridRef.current.columnApi.autoSizeColumns(allColumnIds, false);
  }, []);

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
        gridRef.current.api.getRowNode(selectedElementIndex).setSelected(true);
      }
    } else {
      gridRef.current.api.deselectAll();
    }
  }, [elementSelector, data]);

  const EditOperator = (field) => {
    return (
      <button
      onClick={() =>
        operations.hasOwnProperty("edit") ? operations.edit(field.field.data.id) : {}
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
          operations.hasOwnProperty("view") ? operations.view(field.field.data.id) : {}
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
          operations.hasOwnProperty("delete") ? operations.delete(field.field.data.id) : {}
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
          />
        ))}
        {operations.hasOwnProperty("view") && (
          <AgGridColumn
            key="viewoperator"
            field="View Operator"
            cellRendererFramework={(field) => (
              <ViewOperator field={field} />
            )}
          />
        )}

        {operations.hasOwnProperty("edit") && (
          <AgGridColumn
            key="editoperator"
            field="Edit Operator"
            cellRendererFramework={(field) => (
              <EditOperator field={field} />
            )}
          />
        )}

        {operations.hasOwnProperty("delete") && (
          <AgGridColumn
            key="deleteoperator"
            field="Delete Operator"
            cellRendererFramework={(field) => (
              <DeleteOperator field={field} />
            )}
          />
        )}
      </AgGridReact>
    </div>
  );
};
