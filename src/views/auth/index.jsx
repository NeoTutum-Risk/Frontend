import { Button, Card, Classes, FormGroup, InputGroup } from '@blueprintjs/core'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../../store/user'
import styles from './styles.module.scss'
import logo from "../../images/logo.png"

export const Auth = () => {
  const [user, setUser] = useRecoilState(userState)
  const [password, setPassword] = useState(null)
  const navigate = useNavigate()

  const onSubmit = useCallback(
    e => {
      e.preventDefault()


      navigate('/dashboard')
    },
    [navigate]
  )

  return (
    <div className={styles.container}>
      <img  className={styles.logo} src={logo} alt="logo" />
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
      {/* <div className='bp3-text-muted bp3-text-small'>
        * Enter any arbitrary username and password
      </div> */}
      <div className='bp3-text-muted bp3-text-small'>
        * QA Build 2.5.3
        * Build Time 2022-02-27 10:40
      </div>
    </div>
  )
}