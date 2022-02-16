import { Button, Card, FormGroup, InputGroup } from '@blueprintjs/core'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'

export const Auth = () => {
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState(null)
  const navigate = useNavigate()

  const onSubmit = useCallback(
    e => {
      e.preventDefault()

      console.log('user,password', user, password)

      navigate('/dashboard')
    },
    [user, password, navigate]
  )

  return (
    <div className={styles.container}>
      <h1 className='bp3-heading'>NeoTutum</h1>
      <Card>
        <form className={styles.form} onSubmit={onSubmit}>
          <FormGroup label='User' labelFor='user-input'>
            <InputGroup id='user-input' onChange={event => setUser(event.target.value)} />
          </FormGroup>
          <FormGroup label='Password' labelFor='password-input'>
            <InputGroup
              type='password'
              id='password-input'
              onChange={event => setPassword(event.target.value)}
            />
          </FormGroup>

          <Button className={styles.submit} type='submit'>
            Login
          </Button>
        </form>
      </Card>
      <div className='bp3-text-muted bp3-text-small'>
        * Enter any arbitrary username and password
      </div>
    </div>
  )
}
