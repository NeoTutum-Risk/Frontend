import React from "react";
import DeleteMetaData from "./DeleteMetaData";
import MetaDataForm from "./MetaDataForm";

const MetaDataDialog = (props) => {
  const { deleteMetaData } = props;

  return (
    <div>
      {deleteMetaData ? <DeleteMetaData /> : <MetaDataForm />}
    </div>
  );
};

export default MetaDataDialog;
