//Appointment routes

import { Router } from 'express'

import {
    cancelAppointment,
    createAppointment,
    getAllAppointments,
    getAppointment,
    getAppointmentsFiltered,
    updateAppointment
} from './appointment.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'
import { appointmentValidator } from '../../helpers/validators.js'

const api = Router()

api.post(
    '/createAppointment',
    [validateJwt, appointmentValidator],
    createAppointment
)

api.get(
    '/getAllAppointments',
    [validateJwt],
    getAllAppointments
)

api.get(
    '/getAppointment/:id',
    [validateJwt],
    getAppointment
)

api.get(
    '/getAppointmentByFilter/',
    [validateJwt],
    getAppointmentsFiltered
)

api.put(
    '/updateAppointment/:id',
    [validateJwt],
    updateAppointment
)

api.put(
    '/cancelAppointment/:id',
    [validateJwt],
    cancelAppointment
)

export default api
