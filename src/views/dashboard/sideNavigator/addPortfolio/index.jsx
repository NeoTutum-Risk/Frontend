import { Button, FormGroup, H5, InputGroup, Intent } from '@blueprintjs/core'
import { Classes, Popover2, Tooltip2 } from '@blueprintjs/popover2'
import { useCallback, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { addNewPortfolio } from '../../../../services'
import { protfoliosState } from '../../../../store/portfolios'
import { showDangerToaster, showSuccessToaster } from '../../../../utils/toaster'

export const AddPortfolio = () => {
  const [newPortfolioNameError, setNewPortfolioNameError] = useState(null)
  const [newPortfolioName, setNewPortfolioName] = useState(null)
  const [isAddPortfolioLoading, setIsAddPortfolioLoading] = useState(false)
  const [isPopOverOpen, setIsPopOverOpen] = useState(false)
  const setPortfolios = useSetRecoilState(protfoliosState)

  const addPortfolio = useCallback(
    async event => {
      event.preventDefault()

      if (!newPortfolioName) {
        return setNewPortfolioNameError('Name is required')
      }

      try {
        setIsAddPortfolioLoading(true)
        setNewPortfolioNameError(null)
        setNewPortfolioName(null)

        const { data } = await addNewPortfolio({
          name: newPortfolioName,
        })

        setPortfolios(prevPortfolios => ({
          ...prevPortfolios,
          data: [data.data, ...prevPortfolios.data],
        }))

        setIsAddPortfolioLoading(false)

        setIsPopOverOpen(false)

        showSuccessToaster(`${newPortfolioName} has been successfully created`)
      } catch (error) {
        setNewPortfolioNameError(error.message)
        showDangerToaster(error.message)
        setIsAddPortfolioLoading(false)
      }
    },
    [newPortfolioName, setPortfolios]
  )

  return (
    <Popover2
      isOpen={isPopOverOpen}
      popoverClassName={Classes.POPOVER2_CONTENT_SIZING}
      content={
        <div key='text'>
          <H5>Add New Portfolio</H5>
          <form onSubmit={addPortfolio}>
            <FormGroup
              label='Name'
              labelInfo='(required)'
              intent={newPortfolioNameError ? Intent.DANGER : Intent.NONE}
              helperText={newPortfolioNameError}
              labelFor='newPortfolioName'
            >
              <InputGroup
                required
                id='newPortfolioName'
                onChange={event => {
                  setNewPortfolioNameError(false)
                  setNewPortfolioName(event.target.value)
                }}
              />
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              <Button
                className={Classes.POPOVER2_DISMISS}
                disabled={isAddPortfolioLoading}
                style={{ marginRight: 10 }}
                onClick={() => {
                  setNewPortfolioNameError(false)
                  setIsPopOverOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                loading={isAddPortfolioLoading}
                intent={Intent.SUCCESS}
                className={Classes.POPOVER2_DISMISS}
                onClick={addPortfolio}
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
