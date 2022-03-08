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
  getSpecificMetaData,
  updateMetaData,
} from "../../services";
import { getMetaDataL2Util } from "../../utils/getMetaDataLevel2";
import classes from "./MetaDataDialog.module.css";

const MetaDataForm = () => {
  const [openDialog, setOpenDialog] = useRecoilState(metaDataDialogState);
  const [metaData, setMetaData] = useRecoilState(metaDataState);
  const [loadList, setLoadList] = useRecoilState(metaDataLoadState);

  useEffect(() => {
    if (metaData.type === "edit") {
      getSpecificMetaData(metaData.id).then((res) => {
        let { metaDataLevel2s, name } = res.data.data;

        metaDataLevel2s = getMetaDataL2Util(metaDataLevel2s);

        setMetaData({ ...metaData, name, l2: metaDataLevel2s });
      });
    }
  }, []);

  const closeDialog = () => {
    setMetaData({ id: "", name: "", l2: "", type: "" });
    setOpenDialog(!openDialog);
  };

  const submitData = () => {
    const l2 =
      typeof metaData.l2 === "string" && metaData.l2.length
        ? metaData.l2.split(",")
        : [];
    const data = { name: metaData.name, l2 };

    if (metaData.type === "edit") {
      updateMetaData(metaData.id, data)
        .then((res) => {
          closeDialog();
          setLoadList(!loadList);
        })
        .catch((err) => {
          closeDialog();
          setLoadList(!loadList);
        });
    } else if (metaData.type === "add") {
      addMetaData(data)
        .then((res) => {
          closeDialog();
          setLoadList(!loadList);
        })
        .catch((err) => {
          closeDialog();
          setLoadList(!loadList);
        });
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

      <FormGroup className={classes.l2FormGroup} label="L2" labelFor="l2-input">
        <TextArea
          value={metaData.l2}
          className={classes.l2TextArea}
          id="l2-input"
          onChange={handleMetaDataL2}
        />
      </FormGroup>
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
