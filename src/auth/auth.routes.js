//Auth routes
import { Router } from 'express'
import {
  loginAdmin,
  registerPatient,
  loginPatient
} from './auth.controller.js'

import {
  loginValidator,
  registerPatientValidator,
  loginValidatorPatient
} from '../../helpers/validators.js'

const api = Router()

//  login admin
api.post(
  '/login',
  [loginValidator],
  loginAdmin
)

// Register Patient
api.post(
  '/registerPatient',
  [registerPatientValidator],
  registerPatient
)
// Login Patient
api.post(
  '/loginPatient',
  [loginValidatorPatient],
  loginPatient
)

export default api
