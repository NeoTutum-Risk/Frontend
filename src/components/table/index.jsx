import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { AgGridColumn, AgGridReact } from 'ag-grid-react'
import React from 'react'

export const Table = ({
  width = 600,
  height = 400,
  data = [],
  columns = [],
  paginationPageSize = 10,
}) => {
  return (
    <div className='ag-theme-balham' style={{ height, width }}>
      <AgGridReact pagination paginationPageSize={paginationPageSize} rowData={data}>
        {columns.map(column => (
          <AgGridColumn
            key={column.field}
            field={column.field}
            sortable={column.sortable ?? true}
            filter={column.filter ?? true}
          />
        ))}
      </AgGridReact>
    </div>
  )
}
