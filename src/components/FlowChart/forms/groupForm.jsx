import {
  Intent,
  Spinner,
  Switch,
  Icon,
  Menu,
  MenuDivider,
  Classes,
  MenuItem,
  H5,
  FormGroup,
  InputGroup,
  Button,
  HTMLSelect,
  TextArea,
  FileInput,
  Checkbox,
} from "@blueprintjs/core";
import { set } from "lodash";
import { useCallback } from "react";
import { useState } from "react";
export const GroupFrom = ({ rootCall,groupObjects }) => {
  const [newGroupName, setNewGroupName] = useState(null);
  const [newGroupNameError, setNewGroupNameError] = useState(null);
  const [newGroupDesc, setNewGroupDesc] = useState(null);
  const [newGroupDescError, setNewGroupDescError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const response = await rootCall("group", { newGroupName, newGroupDesc });
      if (response === "Done") {
        setNewGroupDesc(null);
        setNewGroupName(null);
      }
      setIsLoading(false);
    },
    [
      newGroupName,
      newGroupDesc,
      setIsLoading,
      setNewGroupDesc,
      setNewGroupName,
      rootCall,
    ]
  );
  return (
    <div
      key="text3"
      style={{
        backgroundColor: "#30404D",
        color: "white",
        padding: "10px",
        borderRadius: "2px",
      }}
    >
      <H5 style={{ color: "white" }}>New Group</H5>
      <form onSubmit={handleSubmit}>
        <FormGroup
          label="Name"
          labelInfo="(required)"
          intent={newGroupNameError ? Intent.DANGER : Intent.NONE}
          helperText={newGroupNameError}
          labelFor="newGroupName"
        >
          <InputGroup
            required
            id="newGroupName"
            onChange={(event) => {
              setNewGroupNameError(null);
              setNewGroupName(event.target.value);
            }}
          />
        </FormGroup>
        <FormGroup
          label="Description"
          labelInfo="(required)"
          intent={newGroupDescError ? Intent.DANGER : Intent.NONE}
          helperText={newGroupDescError}
          labelFor="newGroupDesc"
        >
          <InputGroup
            required
            id="newGroupDesc"
            onChange={(event) => {
              setNewGroupDescError(null);
              setNewGroupDesc(event.target.value);
            }}
          />
        </FormGroup>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 15,
          }}
        >
          <Button
            disabled={isLoading}
            style={{ marginRight: 10 }}
            onClick={() => {
              setNewGroupNameError(null);
              setNewGroupName(null);
              rootCall("resetContext");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} intent={Intent.SUCCESS}>
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};
