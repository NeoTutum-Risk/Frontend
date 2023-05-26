import { Button, Dialog } from "@blueprintjs/core";
import { useEffect, useState, useCallback } from "react";
import MetaDataDialog from "../../components/metaDataDialog";
import { Table } from "../../components/table";
import { getMetaData } from "../../services";
import {
  metaDataState,
  metaDataDialogState,
  metaDataLoadState,
} from "../../store/metaData";
import { useRecoilState, useRecoilValue } from "recoil";
import { getMetaDataL2Util } from "../../utils/getMetaDataLevel2";
import classes from "./MetaData.module.css";
import { Tooltip2 } from "@blueprintjs/popover2";
import { useNavigate } from "react-router-dom";

const columns = [
  { value: "id", width: 55 },
  { value: "name", width: 800 },
];

const MetaData = () => {
  const [metaDataList, setMetaDataList] = useState([]);
  const [openDialog, setOpenDialog] = useRecoilState(metaDataDialogState);
  const [metaData, setMetaData] = useRecoilState(metaDataState);
  const [selectedMetaDataLevel2Arr, setSelectedMetaDataLevel2Arr] = useState({
    metaDataLevel1Id: null,
    metaDataLevel2sArr: [],
  });
  const loadList = useRecoilValue(metaDataLoadState);

  const initialLoading = useCallback(async () => {
    const res = await getMetaData();

    if (res.status >= 200 && res.status<300) {
      const { data } = res.data;

      // getting all the data from the api but extracting the metadatalevel2's names in an array without there attributes
      /*
      const preparedData = data.map((item) => ({
        ...item,
        metaDataLevel2s: getMetaDataL2Util(item.metaDataLevel2s),
      }));
      */

      setMetaDataList(data);
    }
  }, []);

  useEffect(() => {
    initialLoading();
  }, [initialLoading, loadList]);

  useEffect(() => {
    if (selectedMetaDataLevel2Arr.metaDataLevel1Id) {
      handleViewOperation(selectedMetaDataLevel2Arr.metaDataLevel1Id);
    }
  }, [metaDataList]);

  const openEditOperation = (id) => {
    setOpenDialog(true);

    setMetaData({ ...metaData, id,level: 1, type: "edit" });
  };

  const openDeleteOperation = (id) => {
    setOpenDialog(true);

    setMetaData({ ...metaData, id,level: 1, type: "delete" });
  };

  const openAddOperation = () => {
    setOpenDialog(true);

    setMetaData({ ...metaData,level: 1, type: "add" });
  };

  const openMetaDataLevel2AddOperation = () => {
    setOpenDialog(true);

    const { metaDataLevel1Id } = selectedMetaDataLevel2Arr;

    setMetaData({ ...metaData, type: "add", level: 2, metaDataLevel1Id });
  };

  const openMetaDataLevel2EditOperation = (id) => {
    setOpenDialog(true);

    const { metaDataLevel1Id } = selectedMetaDataLevel2Arr;

    setMetaData({ ...metaData, id, type: "edit", level: 2, metaDataLevel1Id });
  };

  const handleViewOperation = (id) => {
    const foundMetaData = metaDataList.find((metaData) => metaData.id === id);
    const metaDataLevel2sArr = foundMetaData.metaDataLevel2s;
    const metaDataLevel1Name = foundMetaData.name;
    setSelectedMetaDataLevel2Arr({
      metaDataLevel1Id: id,
      metaDataLevel1Name,
      metaDataLevel2sArr,
    });
  };

  const operations = {
    view: { func: handleViewOperation, width: 90 },
    edit: { func: openEditOperation, width: 90 },
    delete: { func: openDeleteOperation, width: 90 },
  };

  const metaDataLevel2Operations = {
    edit: { func: openMetaDataLevel2EditOperation },
  };

  return (
    <div className={classes.metaDataContainer}>
      <Dialog isOpen={openDialog}>
        <MetaDataDialog
          deleteMetaData={metaData.type === "delete" ? true : false}
        />
      </Dialog>
      <div className={classes.header}>
        <div>
          <Button
            intent="success"
            className={classes.btnStyle}
            onClick={openAddOperation}
          >
            Add MetaData
          </Button>
        </div>
        <div className={classes.title}>
          <h1>Risk Object Meta Data</h1>
        </div>
        <div></div>
      </div>

      <div className={classes.tableContainer}>
        <Table
          width={"100%"}
          height={"100%"}
          data={metaDataList}
          columns={columns.map((column) => ({
            field: column.value,
            resizable: true,
            width: column.width,
          }))}
          tableFullWidth={true}
          operations={operations}
        />
      </div>

      {selectedMetaDataLevel2Arr.metaDataLevel1Id && (
        <>
          <div style={{ marginTop: ".5rem" }} className={classes.header}>
            <div>
              <Button
                intent="success"
                className={classes.btnStyle}
                onClick={openMetaDataLevel2AddOperation}
              >
                Add MetaData Level 2
              </Button>
            </div>
            <div className={classes.title}>
              <h1 style={{ padding: 0, margin: "0" }}>
                {selectedMetaDataLevel2Arr.metaDataLevel1Name}
              </h1>
            </div>
            <div></div>
          </div>
          <div
            style={{ marginTop: ".5rem" }}
            className={classes.tableContainer}
          >
            <Table
              width={"100%"}
              height={"100%"}
              data={selectedMetaDataLevel2Arr.metaDataLevel2sArr}
              columns={columns.map((column) => ({
                field: column.value,
                resizable: true,
                width: column.width,
              }))}
              tableFullWidth={true}
              operations={metaDataLevel2Operations}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MetaData;

/*
              window.data.associations?.[0]
                ? Object.keys(window.data.associations?.[0]).map((key) => ({
                    field: key,
                  }))
                : []
*/
