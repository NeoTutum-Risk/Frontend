import { Button } from "@blueprintjs/core";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { deleteMetaData, getSpecificMetaData } from "../../services";
import {
  metaDataDialogState,
  metaDataState,
  metaDataLoadState,
} from "../../store/metaData";
import { getMetaDataL2Util } from "../../utils/getMetaDataLevel2";
import classes from "./MetaDataDialog.module.css";

const DeleteMetaData = () => {
  const [openDialog, setOpenDialog] = useRecoilState(metaDataDialogState);
  const [metaData, setMetaData] = useRecoilState(metaDataState);
  const [loadList, setLoadList] = useRecoilState(metaDataLoadState);

  useEffect(() => {
    getSpecificMetaData(metaData.id).then((res) => {
      let { metaDataLevel2s, name } = res.data.data;

      metaDataLevel2s = getMetaDataL2Util(metaDataLevel2s);

      setMetaData({ ...metaData, name, l2: metaDataLevel2s });
    });
  }, []);

  const closeDialog = () => {
    setMetaData({ id: "", name: "", l2: "", type: "" });
    setOpenDialog(!openDialog);
  };

  const handleDeletion = async () => {
    const res = await deleteMetaData(metaData.id);

    if (res.status === 200) {
      closeDialog();
      setLoadList(!loadList);
    }
  };

  return (
    <div className={classes.deleteDialogContainer}>
      <h1>Are you sure you want to delete this {metaData.name} ?</h1>
      <div className={classes.btnContainer}>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button className={classes.mainBtn} onClick={handleDeletion}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteMetaData;
