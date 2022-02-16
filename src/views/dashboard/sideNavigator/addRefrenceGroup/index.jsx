import { Button, FormGroup, H5, InputGroup, Intent } from '@blueprintjs/core'
import { Classes, Popover2, Tooltip2 } from '@blueprintjs/popover2'
import { useCallback, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { addNewReferenceGroup } from '../../../../services'
import { referenceGroupsState } from '../../../../store/referenceGroups'
import { showDangerToaster, showSuccessToaster } from '../../../../utils/toaster'

export const AddReferenceGroup = () => {
  const [newReferenceGroupNameError, setNewReferenceGroupNameError] = useState(null)
  const [newReferenceGroupName, setNewReferenceGroupName] = useState(null)
  const [isAddReferenceGroupLoading, setIsAddReferenceGroupLoading] = useState(false)
  const [isPopOverOpen, setIsPopOverOpen] = useState(false)
  const setReferenceGroups = useSetRecoilState(referenceGroupsState)

  const addReferenceGroup = useCallback(
    async event => {
      event.preventDefault()

      if (!newReferenceGroupName) {
        return setNewReferenceGroupNameError('Name is required')
      }

      try {
        setIsAddReferenceGroupLoading(true)
        setNewReferenceGroupNameError(null)
        setNewReferenceGroupName(null)

        const { data } = await addNewReferenceGroup({
          name: newReferenceGroupName,
        })

        setReferenceGroups(prevReferenceGroups => ({
          ...prevReferenceGroups,
          data: [data.data, ...prevReferenceGroups.data],
        }))

        setIsAddReferenceGroupLoading(false)

        setIsPopOverOpen(false)

        showSuccessToaster(`${newReferenceGroupName} has been successfully created`)
      } catch (error) {
        setNewReferenceGroupNameError(error.message)
        showDangerToaster(error.message)
        setIsAddReferenceGroupLoading(false)
      }
    },
    [newReferenceGroupName, setReferenceGroups]
  )

  return (
    <Popover2
      isOpen={isPopOverOpen}
      popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
      content={
        <div key='text'>
          <H5>Add New Reference Group</H5>
          <form onSubmit={addReferenceGroup}>
            <FormGroup
              label='Name'
              labelInfo='(required)'
              intent={newReferenceGroupNameError ? Intent.DANGER : Intent.NONE}
              helperText={newReferenceGroupNameError}
              labelFor='newReferenceGroupName'
            >
              <InputGroup
                required
                id='newReferenceGroupName'
                onChange={event => {
                  setNewReferenceGroupNameError(false)
                  setNewReferenceGroupName(event.target.value)
                }}
              />
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              <Button
                className={Classes.POPOVER2_DISMISS}
                disabled={isAddReferenceGroupLoading}
                style={{ marginRight: 10 }}
                onClick={() => {
                  setNewReferenceGroupNameError(false)
                  setIsPopOverOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                loading={isAddReferenceGroupLoading}
                intent={Intent.SUCCESS}
                className={Classes.POPOVER2_DISMISS}
                onClick={addReferenceGroup}
              >
                Add
              </Button>
            </div>
          </form>
        </div>
      }
    >
      <Tooltip2 usePortal={false} content={<span>Add</span>}>
        <Button icon='plus' small onClick={() => setIsPopOverOpen(true)} intent={Intent.SUCCESS} />
      </Tooltip2>
    </Popover2>
  )
}
