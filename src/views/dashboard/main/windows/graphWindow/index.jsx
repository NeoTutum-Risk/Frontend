import { Intent, Spinner, Switch } from "@blueprintjs/core";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { Bpmn } from "../../../../../components/bpmn";
import { updateBpmnStatus } from "../../../../../services";
import { platformState } from "../../../../../store/portfolios";
import { elementSelectorState } from "../../../../../store/elementSelector";
import { showDangerToaster } from "../../../../../utils/toaster";
import { Window } from "../window";

export const GraphWindow = ({
  onClose,
  onCollapse,
  onRestore,
  window,
  collapseState,
  onTypeChange,
}) => {
  const [bpmn, setbpmn] = useRecoilState(platformState(window.data.id));
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveLoading, setAutoSaveLoading] = useState(false);
  const [elementSelector, setElementSelector] =
    useRecoilState(elementSelectorState);
  const elementSelectorHandler = useCallback(
    (data) => {
      const elementId = data.element.id;
      const type = data.element.type;
      if (!elementId) return;
      if (type === "process") {
        setElementSelector(null);
      } else {
        setElementSelector({ elementId, type,fileId: window.data.id });
      }
      console.log({ elementId, type, fileId: window.data.id });
    },
    [setElementSelector, window.data.id]
  );
  const saveBpmn = useCallback(
    async (fileData) => {
      console.log("update bpmn", fileData);
      try {
        setAutoSaveLoading(true);

        await updateBpmnStatus({
          id: window.data.id,
          status: "changed",
          fileData,
        });
        setAutoSaveLoading(false);
      } catch (error) {
        setAutoSaveLoading(false);
        showDangerToaster(error?.response?.data?.msg ?? error.message);
      }
    },
    [window]
  );

  return (
    <Window
      title={window.data.fileName}
      window={window}
      icon="document"
      onClose={onClose}
      onCollapse={onCollapse}
      onRestore={onRestore}
      onTypeChange={onTypeChange}
      collapseState={collapseState}
      headerAdditionalContent={
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Switch
            checked={autoSave}
            style={{ marginBottom: 0 }}
            label="Auto Save"
            onChange={() => setAutoSave((prevAutoSave) => !prevAutoSave)}
          />
          {autoSaveLoading && <Spinner size={12} intent={Intent.PRIMARY} />}
        </div>
      }
    >
      <Bpmn
        xml={bpmn.xml ?? window.data.fileData}
        onChange={(data) => {
          setbpmn({ xml: data, changed: !autoSave });
          if (autoSave) {
            saveBpmn(data);
          }
        }}
        onClick={(data) => elementSelectorHandler(data)}
      />
    </Window>
  );
};
