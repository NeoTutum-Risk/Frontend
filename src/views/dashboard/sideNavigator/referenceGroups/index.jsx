import {
  Button,
  FormGroup,
  H5,
  Icon,
  InputGroup,
  Intent,
  Menu,
  MenuItem,
  Tree,
} from "@blueprintjs/core";
import { Classes, Popover2, Tooltip2 } from "@blueprintjs/popover2";
import cloneDeep from "lodash/cloneDeep";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { referenceGroupsState } from "../../../../store/referenceGroups";

export const ReferenceGroups = () => {
  const [referenceGroups, setReferenceGroups] =
    useRecoilState(referenceGroupsState);
  console.log(referenceGroups);
  return (
    <div>
      {referenceGroups.data.map((referenceGroup) => {
        return <p>{referenceGroup.name}</p>;
      })}
    </div>
  );
};
