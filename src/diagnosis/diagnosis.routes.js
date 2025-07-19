//Diagnosis routes

import { Router } from 'express'

import {
    createDiagnosis,
    getAllDiagnoses,
    getDiagnosis,
    updateDiagnosis
} from './diagnosis.controller.js'

import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { diagnosisValidator } from '../../helpers/validators.js'

const api = Router()

api.post(
    '/createDiagnosis',
    [validateJwt, isAdmin, diagnosisValidator],
    createDiagnosis
)

api.get(
    '/getAllDiagnosis',
    [validateJwt, isAdmin],
    getAllDiagnoses
)

api.get(
    '/getDiagnosis/id/:id',
    [validateJwt, isAdmin],
    getDiagnosis
)

api.get(
    '/getDiagnosis/code/:code',
    [validateJwt, isAdmin],
    getDiagnosis
)

api.get(
    '/getDiagnosis/name/:name',
    [validateJwt, isAdmin],
    getDiagnosis
)

api.put(
    '/updateDiagnosis/:id',
    [validateJwt, isAdmin, diagnosisValidator],
    updateDiagnosis
)

export default api
