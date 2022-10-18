import { IdButton } from "./miniComponents/idButton";
export const MiniFace = ({ id, name, intent, views, editView, viewIndex }) => {
  return (
    <IdButton
      editView={editView}
      view={views[viewIndex]}
      id={id}
      name={name}
      intent={intent}
    />
  );
};
