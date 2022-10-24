import { IdButton } from "./miniComponents/idButton";
export const OpenFace = ({ data, intent, views, editView, viewIndex }) => {
  return (
    <IdButton
      editView={editView}
      view={views[viewIndex]}
      id={data.id}
      intent={intent}
    />
  );
};
