import { Button, Dialog } from "@blueprintjs/core";
import { useEffect, useState } from "react";
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

const columns = ["id", "name", "metaDataLevel2s"];

const MetaData = () => {
  const [metaDataList, setMetaDataList] = useState([]);
  const [openDialog, setOpenDialog] = useRecoilState(metaDataDialogState);
  const [metaData, setMetaData] = useRecoilState(metaDataState);
  const loadList = useRecoilValue(metaDataLoadState);


  const openEditOperation = (id) => {
    setOpenDialog(true);

    setMetaData({ ...metaData, id, type: "edit" });
  };

  const openDeleteOperation = (id) => {
    setOpenDialog(true);

    setMetaData({ ...metaData, id, type: "delete" });
  };

  const openAddOperation = () => {
    setOpenDialog(true);

    setMetaData({ ...metaData, type: "add" });
  };

  const operations = {
    edit: openEditOperation,
    delete: openDeleteOperation,
  };

  useEffect(() => {
    getMetaData().then((res) => {
      const { data: dataList } = res.data;
      const metaDataList = [];

      dataList.forEach((data) => {
        data.metaDataLevel2s = getMetaDataL2Util(data.metaDataLevel2s);
        metaDataList.push({ ...data });
      });

      setMetaDataList(dataList);
    });
  }, [loadList]);

  return (
    <div className={classes.metaDataContainer}>
      <Dialog isOpen={openDialog}>
        <MetaDataDialog
          deleteMetaData={metaData.type === "delete" ? true : false}
        />
      </Dialog>
      <div className={classes.addBtnContainer}>
        <Button onClick={openAddOperation}>Add MetaData</Button>
      </div>

      <h1>Meta Data</h1>
      <div className={classes.tableContainer}>
        <Table
          width={"100%"}
          height={"100%"}
          data={metaDataList}
          columns={columns.map((value) => ({
            field: value,
          }))}
          operations={operations}
        />
      </div>
    </div>
  );
};

export default MetaData;