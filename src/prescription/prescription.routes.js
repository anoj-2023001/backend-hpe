// src/prescription/prescription.routes.js

import { Router } from 'express'
import {
  createPrescription,
  getAllPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription
} from './prescription.controller.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'
import { prescriptionValidator } from '../../helpers/validators.js'

const api = Router()

// Crear una receta (solo Admins)
api.post(
  '/createPrescription',
  [validateJwt, isAdmin, prescriptionValidator],
  createPrescription
)

// Obtener todas las recetas (solo Admins)
api.get(
  '/getAllPrescriptions',
  [validateJwt, isAdmin],
  getAllPrescriptions
)

// Obtener una receta por ID (solo Admins)
api.get(
  '/getPrescription/id/:id',
  [validateJwt, isAdmin],
  getPrescription
)

// Actualizar una receta (solo Admins)
api.put(
  '/updatePrescription/:id',
  [validateJwt, isAdmin, prescriptionValidator],
  updatePrescription
)

// Eliminar una receta (solo Admins)
api.delete(
  '/deletePrescription/:id',
  [validateJwt, isAdmin],
  deletePrescription
)

export default api
