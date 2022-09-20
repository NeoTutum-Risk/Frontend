import { IdButton } from "./miniComponents/idButton";
export const MiniFace = ({ id, intent, views, editView, viewIndex }) => {
  return (
    <IdButton
      editView={editView}
      view={views[viewIndex]}
      id={id}
      intent={intent}
    />
  );
};
