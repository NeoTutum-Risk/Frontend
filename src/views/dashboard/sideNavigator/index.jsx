import { H3, H4 } from '@blueprintjs/core'
import { Async } from '../../../components/asyncHOC'
import styles from '../styles.module.scss'
import { AddPortfolio } from './addPortfolio'
import { AddReferenceGroup } from './addRefrenceGroup'
import {ReferenceGroups} from './referenceGroups'
import { Portfolios } from './portfolios'


export const SideNavigator = () => {
  return (
    <div className={`${styles.sideNavigatorContainer} bp3-dark`}>
      <H3 className={styles.userName}>user name</H3>
      <div className={styles.tree}>
        <div className={styles.addPortfolio}>
          <H4>Reference Groups</H4>
          <AddReferenceGroup />
        </div>
        <Async>
          <ReferenceGroups />
        </Async>
      </div>
      <div className={styles.tree}>
        <div className={styles.addPortfolio}>
          <H4>Portfolios</H4>
          <AddPortfolio />
        </div>
        <Async>
          <Portfolios />
        </Async>
      </div>
    </div>
  )
}
