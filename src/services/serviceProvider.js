import axios from 'axios'
import { BACKEND_URI } from '../constants'

export const serviceProvider = axios.create({ baseURL: BACKEND_URI })
