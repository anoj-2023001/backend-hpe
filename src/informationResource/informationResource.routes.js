import { Router } from 'express'
import {
    getAllInformationResources,
    getInformationResourceById,
    createInformationResource,
    updateInformationResource,
    deleteInformationResource,
    searchInformationResourceByTitle,
    filterByCategory,
    filterByType
} from './informationResource.controller.js'
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js'

const api = Router()

// Get all information resources (ADMIN)
api.get(
    '/allResources',
    [validateJwt, isAdmin],
    getAllInformationResources
)

// Get information resource by ID
api.get(
    '/getOne/:id',
    [validateJwt],
    getInformationResourceById
)

// Create new information resource (ADMIN)
api.post(
    '/create',
    [validateJwt, isAdmin],
    createInformationResource
)

// Update information resource (ADMIN)
api.put(
    '/update/:id',
    [validateJwt, isAdmin],
    updateInformationResource
)

// Delete information resource (ADMIN)
api.delete(
    '/delete/:id',
    [validateJwt, isAdmin],
    deleteInformationResource
)

// Search information resources by title
api.get(
    '/searchByTitle',
    [validateJwt],
    searchInformationResourceByTitle
)

// Filter information resources by category
api.get(
    '/filter/category',
    [validateJwt],
    filterByCategory
)

// Filter information resources by type
api.get(
    '/filter/type',
    [validateJwt],
    filterByType
)

export default api