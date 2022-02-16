import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { Async } from '../components/asyncHOC'
import { Routes } from './routes'

export const Router = () => {
  return (
    <StrictMode>
      <RecoilRoot>
        <BrowserRouter>
          <Async errorMessage>
            <Routes />
          </Async>
        </BrowserRouter>
      </RecoilRoot>
    </StrictMode>
  )
}
