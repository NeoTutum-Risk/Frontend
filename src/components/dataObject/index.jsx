import {Table} from "../table";
import classes from "./dataObject.css";
import { Button, Dialog } from "@blueprintjs/core";
import { AddObjectForm } from "./addObjectForm";
import { useCallback, useEffect, useState } from "react";
import { getNewDataObjects } from "../../services";
export const DataObject = () => {
  const [addNewObjectDialog, setAddNewObjectDialog] = useState(false);
  const [objects, setObjects] = useState([]);

  const getData = useCallback(async () => {
    const response = await getNewDataObjects();
    if (response.status >= 200 && response.status<300) {
      setObjects(response.data.data);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div style={{height:"100%",padding:"15px"}}>
      <Dialog isOpen={addNewObjectDialog}>
        <AddObjectForm getData={getData} setAddNewObjectDialog={setAddNewObjectDialog} />
      </Dialog>
      <div className={classes.header}>
        <div>
          <Button
            intent="success"
            className={classes.btnStyle}
            onClick={() => setAddNewObjectDialog(true)}
          >
            Add Data Object
          </Button>
        </div>
        <div className={classes.title}>
          <h1>Data Objects</h1>
        </div>
        <div></div>
      </div>

      <div style={{height:"70%"}}>
        <Table
          width={"100%"}
          height={"100%"}
          data={objects}
          columns={
            objects?.[0]
              ? Object.keys(objects?.[0]).map((key) => ({
                  field: key,
                  suppressSizeToFit:true
                }))
              : []
          }
          tableFullWidth={true}
          // operations={operations}
        />
      </div>
    </div>
  );
};
