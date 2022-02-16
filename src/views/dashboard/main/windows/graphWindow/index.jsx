import { Intent, Spinner, Switch } from '@blueprintjs/core'
import { useCallback, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Bpmn } from '../../../../../components/bpmn'
import { updateBpmnStatus } from '../../../../../services'
import { platformState } from '../../../../../store/portfolios'
import { showDangerToaster } from '../../../../../utils/toaster'
import { Window } from '../window'

export const GraphWindow = ({ onClose, window }) => {
  const [bpmn, setbpmn] = useRecoilState(platformState(window.data.id))
  const [autoSave, setAutoSave] = useState(true)
  const [autoSaveLoading, setAutoSaveLoading] = useState(false)

  const saveBpmn = useCallback(
    async fileData => {
      try {
        setAutoSaveLoading(true)

        await updateBpmnStatus({
          id: window.data.id,
          status: 'changed',
          fileData,
        })
        setAutoSaveLoading(false)
      } catch (error) {
        setAutoSaveLoading(false)
        showDangerToaster(error?.response?.data?.msg ?? error.message)
      }
    },
    [window]
  )

  return (
    <Window
      title={window.data.fileName}
      icon='document'
      onClose={onClose}
      headerAdditionalContent={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Switch
            checked={autoSave}
            style={{ marginBottom: 0 }}
            label='Auto Save'
            onChange={() => setAutoSave(prevAutoSave => !prevAutoSave)}
          />
          {autoSaveLoading && <Spinner size={12} intent={Intent.PRIMARY} />}
        </div>
      }
    >
      <Bpmn
        xml={bpmn.xml ?? window.data.fileData}
        onChange={data => {
          setbpmn({ xml: data, changed: !autoSave })
          if (autoSave) {
            saveBpmn(data)
          }
        }}
      />
    </Window>
  )
}
