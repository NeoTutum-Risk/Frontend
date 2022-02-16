import { Main } from './main'
import { SideNavigator } from './sideNavigator'
import styles from './styles.module.scss'

export const Dashboard = () => {
  return (
    <div className={styles.container}>
      <SideNavigator />
      <Main />
    </div>
  )
}
