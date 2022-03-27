import { Button } from "@blueprintjs/core"
import classes from "./confirmDelete.module.css"

const ConfirmDelete = ({handleConfirm, handleCloseDialog}) => {
  return (
    <div className={classes.modalContainer}>
      <div>
        <h1>Are you sure?</h1>
      </div>
      <div>
        <p className={classes.confirmText}>
          Are you sure you want to empty database ? YOU CAN'T undo this action
          anymore if you empty it.
        </p>
      </div>
      <div className={classes.buttonContainer}>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button className={classes.deleteBtn} intent="danger" onClick={handleConfirm}>Delete</Button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
