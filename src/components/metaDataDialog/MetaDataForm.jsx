import { useRecoilState } from "recoil";
import {
  metaDataDialogState,
  metaDataLoadState,
  metaDataState,
} from "../../store/metaData";
import { FormGroup, TextArea, InputGroup, Button } from "@blueprintjs/core";
import { useEffect } from "react";
import {
  addMetaData,
  addMetaDataLevel2,
  getSpecificMetaData,
  updateMetaData,
  updateMetaDataLevel2,
} from "../../services";
import { getMetaDataL2Util } from "../../utils/getMetaDataLevel2";
import classes from "./MetaDataDialog.module.css";

const MetaDataForm = () => {
  const [openDialog, setOpenDialog] = useRecoilState(metaDataDialogState);
  const [metaData, setMetaData] = useRecoilState(metaDataState);
  const [loadList, setLoadList] = useRecoilState(metaDataLoadState);

  useEffect(() => {
    if (metaData.type === "edit") {
      /*
      getSpecificMetaData(metaData.id).then((res) => {
        let { metaDataLevel2s, name } = res.data.data;

        metaDataLevel2s = getMetaDataL2Util(metaDataLevel2s);

        setMetaData({ ...metaData, name, l2: metaDataLevel2s });
      });
      */

      if (metaData.level === 2) {
        getSpecificMetaData(metaData.metaDataLevel1Id).then((res) => {
          let { name } = res.data.data.metaDataLevel2s.find(
            (metaDataLevel2) => metaDataLevel2.id === metaData.id
          );
          setMetaData({ ...metaData, name });
        });
        return;
      }

      getSpecificMetaData(metaData.id).then((res) => {
        let { name } = res.data.data;
        setMetaData({ ...metaData, name });
      });
    }
  }, []);

  const closeDialog = () => {
    setMetaData({ id: "", name: "", l2: "", type: "" });
    setOpenDialog(!openDialog);
  };

  const submitData = async () => {
    let l2 = metaData.l2;
    if (typeof l2 === "string") {
      l2 = l2.length ? l2.split(",") : [];
    }

    const data = { name: metaData.name, level2Names: l2 };

    let res;

    if (metaData.type === "edit") {
      if (metaData.level === 2) {
        res = await updateMetaDataLevel2(metaData.id, { name: metaData.name });
        if (res.status === 200) {
          closeDialog();
          setLoadList(!loadList);
        }
        return;
      }
      // else
      res = await updateMetaData(metaData.id, { name: metaData.name });
      if (res.status === 200) {
        closeDialog();
        setLoadList(!loadList);
      }
    } else if (metaData.type === "add") {

      if(metaData.level === 2){
        const { metaDataLevel1Id } = metaData
        res = await addMetaDataLevel2({metaDataLevel1Id, name: metaData.name });
        (res)
        if (res.status === 200) {
          closeDialog();
          setLoadList(!loadList);
        }
        return;
      }

      res = await addMetaData(data);
      if (res.status === 200) {
        closeDialog();
        setLoadList(!loadList);
      }
    }
  };

  const handleMetaDataName = (e) => {
    setMetaData({ ...metaData, name: e.target.value });
  };

  const handleMetaDataL2 = (e) => {
    setMetaData({ ...metaData, l2: e.target.value });
  };

  return (
    <div className={classes.formContainer}>
      <div>
        <FormGroup label="Name" labelFor="name-input">
          <InputGroup
            value={metaData.name}
            id="name-input"
            onChange={handleMetaDataName}
          />
        </FormGroup>
      </div>
      {metaData.type === "add" && metaData.level !== 2 && (
        <FormGroup
          className={classes.l2FormGroup}
          label="L2"
          labelFor="l2-input"
        >
          <TextArea
            value={metaData.l2}
            className={classes.l2TextArea}
            id="l2-input"
            onChange={handleMetaDataL2}
          />
        </FormGroup>
      )}

      <div className={classes.btnContainer}>
        <Button onClick={closeDialog}>Cancel</Button>

        <Button onClick={submitData} className={classes.mainBtn}>
          {metaData.type === "add" ? "Add" : "Edit"}
        </Button>
      </div>
    </div>
  );
};

export default MetaDataForm;
