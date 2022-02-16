import { atom, atomFamily, selector } from 'recoil'
import { getReferenceGroups } from '../services'

export const referenceGroupsState = atom({
  key: 'referenceGroups',
  default: selector({
    key: 'UserInfo/referenceGroups',
    get: async () => {
      try {
        const { data } = await getReferenceGroups()
        return data
      } catch (error) {
        throw error.message
      }
    },
  }),
})

