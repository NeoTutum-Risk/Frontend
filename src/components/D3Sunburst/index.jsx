import { Button, ButtonGroup } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { memo, useCallback, useEffect, useState, useRef } from 'react';
import React from 'react';
import Sunburst from 'react-d3-zoomable-sunburst';

export const D3Sunburst = ({ data, dimensions, onChange }) => {

  return (
    <div style={{width: '100%', height: '100%', display:"flex",flexDirection:"column"}}>
      <Sunburst
              data={data}
              scale="exponential"
              tooltipContent={ <div class="sunburstTooltip" style="position:absolute; color:'black'; z-index:10; background: #e2e2e2; padding: 5px; text-align: center;" /> }
              tooltip
              tooltipPosition="right"
              keyId="Sunburst"
              width={dimensions.width}
              height={dimensions.height}
          />
    </div>
  )

}
