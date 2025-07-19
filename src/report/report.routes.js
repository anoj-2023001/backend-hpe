//Report routes
import { Router } from 'express'
import { downloadHospitalReport } from './report.controller.js'

const api = Router()

api.post('/reports/hospital/pdf', downloadHospitalReport)

export default api
