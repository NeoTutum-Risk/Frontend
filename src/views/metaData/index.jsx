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
  { value: "name", width: 200 },
  { value: "metaDataLevel2s", width: 680 },
];

const MetaData = () => {
  const [metaDataList, setMetaDataList] = useState([]);
  const [openDialog, setOpenDialog] = useRecoilState(metaDataDialogState);
  const [metaData, setMetaData] = useRecoilState(metaDataState);
  const loadList = useRecoilValue(metaDataLoadState);

  const navigate = useNavigate();

  const initialLoading = useCallback(async () => {
    const res = await getMetaData();

    if (res.status === 201) {
      const { data } = res.data;

      // getting all the data from the api but extracting the metadatalevel2's names in an array without there attributes
      const preparedData = data.map((item) => ({
        ...item,
        metaDataLevel2s: getMetaDataL2Util(item.metaDataLevel2s),
      }));

      setMetaDataList(preparedData);
    }
  }, [setMetaData]);

  useEffect(() => {
    initialLoading();
  }, [initialLoading, loadList]);

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
    edit: { func: openEditOperation, width: 110 },
    delete: { func: openDeleteOperation, width: 110 },
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
          <Button intent="success" className={classes.btnStyle} onClick={openAddOperation}>
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
