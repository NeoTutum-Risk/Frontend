import { atom, atomFamily, selector } from 'recoil'
import { getPortfolios } from '../services'

export const protfoliosState = atom({
  key: 'protfolios',
  default: selector({
    key: 'UserInfo/Default',
    get: async () => {
      try {
        const { data } = await getPortfolios()
        return data
      } catch (error) {
        throw error.message
      }
    },
  }),
})

export const platformState = atomFamily({
  key: 'platform',
  default: {
    xml: null,
    changed: false,
  },
})
