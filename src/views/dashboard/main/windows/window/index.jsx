import { Button, ButtonGroup, Card, Elevation, Icon, Intent,Menu,MenuItem } from '@blueprintjs/core'
import { Popover2,Tooltip2 } from '@blueprintjs/popover2'
import React, { useState } from 'react'
import { ResizableBox } from 'react-resizable'
import styles from '../../../styles.module.scss'
import {AddWindowsButton} from "../../addWindowsButton"

export const Window = ({ icon, title, onClose, children, headerAdditionalContent = null },props) => {
  const [isMaximize, setIsMaximize] = useState(false)
  const [isCollapse, setIsCollapse] = useState(false)
  return (
    <ResizableBox
      className={isMaximize ? styles.windowContainerMax : styles.windowContainer}
      width={500}
      height={400}
      minConstraints={[500, 300]}
    >
      <Card
        className={`${styles.windowCard} `}
        style={{ width: '100%', height: '100%' }}
        elevation={Elevation.TWO}
      >
        <div className={`handle bp3-dark ${styles.windowHeader}`}>
          <div className={styles.windowHeader_title}>
            <Icon icon={icon} />
            <div className='bp3-ui-text'>{title}</div>
          </div>
          <Popover2
            content={
              <Menu>
                <MenuItem icon='graph' text='BPMN Graph' />
                <MenuItem icon='th' text='BPMN Associations'/>
                <MenuItem icon='th' text='BPMN Entities' />
                <MenuItem icon='th' text='BPMN SequenceFlows'  />
                <MenuItem icon='th' text='Lanes'  />
              </Menu>
            }
          >
            <Button small loading={false} icon='eye-open' text="Change Type" />
          </Popover2>
          
          {headerAdditionalContent}
          <ButtonGroup>
          <AddWindowsButton />
          <Tooltip2 content={<span>{isCollapse ? 'Expand' : 'Collapse'}</span>}>
              <Button
                onClick={() => setIsCollapse(prevIsCollapse => !prevIsCollapse)}
                icon={isCollapse ? 'double-chevron-down' : 'double-chevron-up'}
                small
                intent={Intent.PRIMARY}
              />
            </Tooltip2>
            <Tooltip2 content={<span>{isMaximize ? 'minimize' : 'maximize'}</span>}>
              <Button
                onClick={() => setIsMaximize(prevIsMaximize => !prevIsMaximize)}
                icon={isMaximize ? 'minimize' : 'maximize'}
                small
                intent={Intent.PRIMARY}
              />
            </Tooltip2>
            <Tooltip2 content={<span>close</span>}>
              <Button onClick={onClose} icon='cross' intent={Intent.DANGER} small />
            </Tooltip2>
          </ButtonGroup>
        </div>
        <div className={styles.windowBody}>{children}</div>
      </Card>
    </ResizableBox>
  )
}
