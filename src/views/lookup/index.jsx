import { Button } from "@blueprintjs/core";
import { useEffect, useState, useCallback } from "react";
import { Table } from "../../components/table";
import { getAllLookup } from "../../services";
import { useRecoilState } from "recoil";
import classes from "./Lookup.module.css";
import { Tooltip2 } from "@blueprintjs/popover2";
import { useNavigate } from "react-router-dom";
import { AddUpload } from "./addUpload";
import { lookupListState, lookupTableState } from "../../store/lookup";
import { useDispatch, useSelector } from "react-redux";
import { setLookupList, setLookupTable } from "../../slices/lookup-slice";

const columns = [
  { value: "id", width: 100 },
  { value: "x", width: 260 },
  { value: "y", width: 300 },
  { value: "value", width: 150 },
  { value: "criteria", width: 250 },
  { value: "probability", width: 200 },
];

const filesColumns = [
  { value: "id" },
  { value: "tableName" }
];

const Lookup = () => {
  const [loading, setLoading] = useState(false);
  //const [lookupList, setLookupList] = useRecoilState(lookupListState);
  //const [lookupTable, setLookupTable] = useRecoilState(lookupTableState);
  const lookupList = useSelector(state => state.lookupReducer.lookupList)
  const lookupTable = useSelector(state => state.lookupReducer.lookupTable)
  const dispatch = useDispatch()

  const initialLoading = useCallback(async () => {
    const res = await getAllLookup();

    if (res.status === 200) {
      const { data } = res.data;

      dispatch(setLookupList(data))
      //setLookupList(data);
    }
  }, [setLookupList]);

  useEffect(() => {
    initialLoading();
  }, [initialLoading, loading]);

  const showInTable = (id) => {
    const selectedLookupList = lookupList.find((lookup) => lookup.id === id)
    //setLookupTable(selectedLookupList);
    dispatch(setLookupTable(selectedLookupList))
  };


  const operations = {
    view: { func: showInTable },
  };

  return (
    <div className={classes.metaDataContainer}>
      <div className={classes.header}>
        <div>
          <AddUpload setLoading={setLoading} loading={loading} />
        </div>
        <div className={classes.title}>
          <h1>Look-up</h1>
        </div>
        <div></div>
      </div>


      <div className={classes.fileTableContainer}>
          <Table
            width={"100%"}
            height={"100%"}
            data={lookupList}
            columns={filesColumns.map((column) => ({
              field: column.value,
              resizable: true
            }))}
            operations={operations}
            tableFullWidth={true}
          />
        </div>

      {lookupList && (
        <div className={classes.tableContainer}>
          <Table
            width={"100%"}
            height={"100%"}
            data={lookupTable.lookupRows}
            columns={columns.map((column) => ({
              field: column.value,
              resizable: true,
              width: column.width,
            }))}
            tableFullWidth={true}
          />
        </div>
      )}
    </div>
  );
};

export default Lookup;
