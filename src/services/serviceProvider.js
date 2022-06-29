import axios from 'axios'
import { BACKEND_URI, TEST_BACKEND_URI } from '../constants'

export const serviceProvider = axios.create({ baseURL: BACKEND_URI })

export const testServiceProvider = axios.create({ baseURL: TEST_BACKEND_URI })
