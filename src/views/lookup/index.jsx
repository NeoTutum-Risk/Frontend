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

const columns = [
  { value: "id", width: 100 },
  { value: "PoC", width: 260 },
  { value: "PoD", width: 300 },
  { value: "value", width: 150 },
  { value: "criteria", width: 250 },
  { value: "probability", width: 200 },
];

const filesColumns = [
  { value: "id" },
];

const Lookup = () => {
  const [loading, setLoading] = useState(false);
  const [lookupList, setLookupList] = useRecoilState(lookupListState);
  const [lookupTable, setLookupTable] = useRecoilState(lookupTableState);

  console.log(lookupList)

  const navigate = useNavigate();

  const initialLoading = useCallback(async () => {
    const res = await getAllLookup();

    if (res.status === 200) {
      const { data } = res.data;

      setLookupList(data);
    }
  }, [setLookupList]);

  useEffect(() => {
    initialLoading();
  }, [initialLoading, loading]);

  const showInTable = (id) => {
    setLookupTable(lookupList.find((lookup) => lookup.id === id));
  };


  const operations = {
    view: { func: showInTable },
  };

  return (
    <div className={classes.metaDataContainer}>
      <div className={classes.header}>
        <div>
          <Tooltip2 content={<span>Dashboard</span>}>
            <Button
              className={classes.btnStyle}
              icon="home"
              onClick={() => navigate("/dashboard")}
            />
          </Tooltip2>
          <Tooltip2 content={<span>Admin Panel</span>}>
            <Button
              className={classes.btnStyle}
              icon="person"
              onClick={() => navigate("/admin-panel")}
            />
          </Tooltip2>
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
