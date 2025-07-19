//Pharmacy routes
import { Router } from 'express'
import {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  filterByProvider,
  filterByExpiration,
  filterByLowStock
} from './pharmacy.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'
import { addMedicineValidator, updateMedicineValidator } from '../../helpers/validators.js'

const api = Router()

// Crear medicamento (solo ADMIN)
api.post(
  '/addMedicine',
  [validateJwt, isAdmin, addMedicineValidator],
  addMedicine
)

// Obtener todos los medicamentos
api.get(
  '/allMedicines',
  [validateJwt],
  getAllMedicines
)

// Obtener un medicamento por ID
api.get(
  '/getOne/:id',
  [validateJwt],
  getMedicineById
)

// Actualizar medicamento
api.put(
  '/update/:id',
  [validateJwt, isAdmin, updateMedicineValidator],
  updateMedicine
)

// Eliminar (desactivar) medicamento
api.delete(
  '/delete/:id',
  [validateJwt, isAdmin],
  deleteMedicine
)

// Filtrar por proveedor
api.post(
  '/filter/provider',
  [validateJwt],
  filterByProvider
)

// Filtrar por fecha de vencimiento
api.post(
  '/filter/expiration',
  [validateJwt],
  filterByExpiration
)

// Filtrar por bajo stock
api.post(
  '/filter/lowStock',
  [validateJwt],
  filterByLowStock
)

export default api