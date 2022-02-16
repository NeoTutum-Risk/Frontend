import { Icon, Intent } from '@blueprintjs/core'
import styles from './styles.module.scss'

export const Error = ({ message = '' }) => {
  return (
    <div className={styles.container}>
      <Icon icon='delete' intent={Intent.DANGER} />
      <div>{message}</div>
    </div>
  )
}
