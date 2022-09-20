import { ButtonGroup,Menu, Button, MenuItem } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
export const IdButton = ({ id, intent,view,editView }) => {
  return (
    <ButtonGroup>
        <Button text={id} intent={intent} onClick={()=>editView('next')}/>
    <Popover2
      content={
        <Menu>
          <MenuItem text="Mini Face" onClick={()=>editView('mini')}/>
          <MenuItem text="Default Face" onClick={()=>editView('default')}/>
          <MenuItem text="Open Face" onClick={()=>editView('open')}/>
          <MenuItem text="Full Face" onClick={()=>editView('full')}/>
        </Menu>
      }
    >
      <Button
        className="panningDisabled pinchDisabled wheelDisabled"
        intent={"none"}
        text={view}
        tabIndex={0}
      />
    </Popover2>

    </ButtonGroup>
  );
};
