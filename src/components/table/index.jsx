import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import {Slider} from "@blueprintjs/core";
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
}) => {
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
    if (elementSelector) {
      const selectedElementIndex = data
        .map((row) => row.elementId)
        .indexOf(elementSelector);
      if (selectedElementIndex > -1) {
        gridRef.current.api.getRowNode(selectedElementIndex).setSelected(true);
      }
    } else {
      gridRef.current.api.deselectAll();
    }
  }, [elementSelector, data]);

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
      </AgGridReact>
    </div>
  );
};
