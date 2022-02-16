import { Spinner } from '@blueprintjs/core'
import styles from './styles.module.scss'

export const Loading = () => {
  return (
    <div className={styles.spinnerContainer}>
      <Spinner />
    </div>
  )
}
