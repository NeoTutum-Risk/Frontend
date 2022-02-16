import { Table } from '../../../../../components/table'
import { Window } from '../window'

export const DataWindow = ({ window, onClose }) => {
  return (
    <Window onClose={onClose} title={window.data.type} icon='th'>
      <>
        {window.data.type === 'BPMN Associations' && (
          <Table
            width={'100%'}
            height={'100%'}
            data={window.data.associations}
            columns={
              window.data.associations?.[0]
                ? Object.keys(window.data.associations?.[0]).map(key => ({ field: key }))
                : []
            }
          />
        )}
        {window.data.type === 'BPMN Entities' && (
          <Table
            width={'100%'}
            height={'100%'}
            data={window.data.entities}
            columns={
              window.data.entities?.[0]
                ? Object.keys(window.data.entities?.[0]).map(key => ({ field: key }))
                : []
            }
          />
        )}
        {window.data.type === 'BPMN SequenceFlows' && (
          <Table
            width={'100%'}
            height={'100%'}
            data={window.data.sequenceFlows}
            columns={
              window.data.sequenceFlows?.[0]
                ? Object.keys(window.data.sequenceFlows?.[0]).map(key => ({ field: key }))
                : []
            }
          />
        )}
        {window.data.type === 'Lanes' && (
          <Table
            width={'100%'}
            height={'100%'}
            data={window.data.lanes}
            columns={
              window.data.lanes?.[0]
                ? Object.keys(window.data.lanes?.[0]).map(key => ({ field: key }))
                : []
            }
          />
        )}
      </>
    </Window>
  )
}
