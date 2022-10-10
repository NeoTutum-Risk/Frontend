import { Menu, MenuItem,Classes } from "@blueprintjs/core";

export const ContextMenuComponent = ({ menu }) => {
  return (
    menu.length>0 && <Menu className={` ${Classes.ELEVATION_1}`} style={{padding:"5px"}}>
      {menu.map((item) => (
        <MenuItem text={item.name} onClick={item.handleClick}>
          {menu.children
            ? menu.children.map((item) => (
                <MenuItem text={item.name} onClick={()=>{('clicked')}} />
              ))
            : null}
        </MenuItem>
      ))}
    </Menu>
  );
};
